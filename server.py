#!/usr/bin/python

from flask import Flask, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import os.path
from flask.ext.autoindex import AutoIndex

import datetime, time
import json
import psycopg2, psycopg2.extras
import duckduckgo
import urllib2

UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = set(['svg', 'png', 'jpg', 'jpeg', 'gif'])

# Setup Flask app.
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
AutoIndex(app, browse_root=os.path.curdir)
app.debug = True

# Connect to PostgreSQL.
conn = psycopg2.connect(database="", user="", password="", host="")


# 'Model' functions.
def find_all_dvds(conn):
  cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  cursor.execute("""
                 select id, title, created_by, rating, extract(epoch from created_at) as created_at,
                        abstract as abstract_txt, abstract_source, abstract_url, image_url, file_url
                 from dvds
                 """)
  dvds = cursor.fetchall()
  cursor.close()
  return dvds

def find_by_id(conn, id):
  cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  cursor.execute("""
                 select id, title, created_by, rating, extract(epoch from created_at) as created_at, 
                        abstract as abstract_txt, abstract_source, abstract_url, image_url, file_url
                 from dvds where id = %s;
                 """ % (id))
  dvd = cursor.fetchone()
  cursor.close()
  return dvd

def add_dvd(conn, data):
  cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

  ddg_info = get_ddg_info(data) 

  try:
    cursor.execute("""
                   insert into dvds (title, created_at, created_by, rating, 
                                     abstract, abstract_source, abstract_url, image_url) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                   returning id, title, created_by, rating, extract(epoch from created_at) as created_at
                   """, (data['title'], datetime.datetime.now(), data['created_by'], data['rating'],
                         ddg_info.abstract.text, ddg_info.abstract.source, ddg_info.abstract.url, ddg_info.image.url) )
    dvd = cursor.fetchone()
    conn.commit()
    cursor.close()
    return dvd
  except psycopg2.IntegrityError as e:
    conn.rollback()
    cursor.close()
    if (e.pgcode == '23505'):
      return {"created_by": "error", "title": data['title'] + " already exists."}
    else:
      return False

def get_ddg_info(data):
  r = duckduckgo.query(data['title'])

  image_file = r.image.url.split('/')[-1]

  try:
    response = urllib2.urlopen(r.image.url)
    image_output = open('static/images/' + image_file, 'w')
    image_output.write(response.read())
    image_output.close()
  
    r.image.url = 'images/' + image_file
  except ValueError:
    r.image.url = ''

  return r

def update_dvd(conn, dvd_id, data):
  try:
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("update dvds set rating = %s where id = %s", (data['rating'], dvd_id ));
    cursor.execute("update dvds set title = %s where id = %s", (data['title'], dvd_id ));
    cursor.execute("update dvds set created_by = %s where id = %s", (data['created_by'], dvd_id ));
    cursor.execute("update dvds set abstract = %s where id = %s", (data['abstract_txt'], dvd_id ));
    cursor.execute("update dvds set abstract_source = %s where id = %s", (data['abstract_source'], dvd_id ));
    cursor.execute("update dvds set abstract_url = %s where id = %s", (data['abstract_url'], dvd_id ));
    cursor.execute("update dvds set image_url = %s where id = %s", (data['image_url'], dvd_id ));
    cursor.execute("update dvds set file_url = %s where id = %s", (data['file_url'], dvd_id ));
    conn.commit()
    cursor.close()

    return find_by_id(conn, dvd_id)
  except psycopg2.IntegrityError as e:
    conn.rollback()
    cursor.close()
    if (e.pgcode == '23505'):
      return {"created_by": "error", "title": data['title'] + " already exists.", "rating": data['rating'], "id": dvd_id}
    else:
      return False

def delete_dvd(conn, dvd_id):
  cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  dvd_id = str(dvd_id)
  cursor.execute("delete from dvds where id = " + dvd_id)
  cursor.close()
  return conn.commit()


# Routes
@app.route('/dvds', methods=['GET', 'POST'])
def find_all():
  if (request.method == 'GET'):
    dvds = {'dvds': find_all_dvds(conn)}
    return json.dumps(dvds)
  elif (request.method == 'POST'):
    dvd = add_dvd(conn, json.loads(request.data)['dvd'])
    #print dvd
    return json.dumps({"dvd": dvd})

@app.route('/dvds/<int:dvd_id>', methods=['GET', 'PUT', 'POST', 'DELETE'])
def show_dvd(dvd_id):
  if (request.method == 'GET'):
    # Show the DVD with the given id, the id is an integer.
    return json.dumps({ "dvd": find_by_id(conn, dvd_id) })
  elif (request.method == 'PUT'):

    status = update_dvd(conn, dvd_id, json.loads(request.data)['dvd'])
    return json.dumps({"dvd": status})
  elif (request.method == 'POST'):
    # Handle the image file upload.
    file = request.files['file']
    if file and allowed_file(file.filename):
      filename = secure_filename(file.filename)
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
      return json.dumps(True)

  elif (request.method == 'DELETE'):
    delete_dvd(conn, dvd_id)
    return json.dumps(True)

def allowed_file(filename):
  return '.' in filename and \
    filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


if __name__ == '__main__':
  app.run()

