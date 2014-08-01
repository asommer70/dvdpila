#!/usr/bin/python

from flask import Flask, request, redirect, url_for, send_from_directory, g
from werkzeug.utils import secure_filename
import os.path

import datetime, time
import json
import psycopg2, psycopg2.extras
import duckduckgo
import urllib2

import ConfigParser, os

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

config = ConfigParser.ConfigParser()
config.readfp(open(os.path.join(__location__, 'config.cfg')))


# Setup Flask app.
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = config.get('Server', 'upload_folder')
app.debug = config.getboolean('Server', 'debug')

# Connect to PostgreSQL.
def connect_db():
  """Connects to the specific database."""
  conn = psycopg2.connect(database=config.get('Database', 'db'), user=config.get('Database', 'db_user'), 
                          password=config.get('Database', 'db_pass'), host=config.get('Database', 'host'))
  return conn

def get_db():
  """
  Opens a new database connection if there is none yet for the current application context.
  """
  if not hasattr(g, 'pg_db'):
    g.pg_db = connect_db()
  return g.pg_db


@app.teardown_appcontext
def close_db(error):
  """Closes the database again at the end of the request."""
  if hasattr(g, 'pg_db'):
    g.pg_db.close()


# 'Model' functions.
def find_all_dvds():
  db = get_db()
  cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  cursor.execute("""
                 select id, title, created_by, rating, extract(epoch from created_at) as created_at,
                        abstract as abstract_txt, abstract_source, abstract_url, image_url, file_url
                 from dvds
                 """)
  dvds = cursor.fetchall()
  cursor.close()
  return dvds

def find_by_id(id):
  db = get_db()
  cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  cursor.execute("""
                 select id, title, created_by, rating, extract(epoch from created_at) as created_at, 
                        abstract as abstract_txt, abstract_source, abstract_url, image_url, file_url
                 from dvds where id = %s;
                 """ % (id))
  dvd = cursor.fetchone()
  cursor.close()
  return dvd

def find_by_title(title):
  db = get_db()
  cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  cursor.execute("""
                 select id, title, created_by, rating, extract(epoch from created_at) as created_at, 
                        abstract as abstract_txt, abstract_source, abstract_url, image_url, file_url
                 from dvds where title ~* '%s';
                 """ % (title))
  dvds = cursor.fetchall()
  cursor.close()
  return dvds

def add_dvd(data):
  db = get_db()
  cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

  ddg_info = get_ddg_info(data) 

  try:
    cursor.execute("""
                   insert into dvds (title, created_at, created_by, rating, 
                                     abstract, abstract_source, abstract_url, image_url) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                   returning id, title, created_by, rating, extract(epoch from created_at) as created_at
                   """, (data['title'], datetime.datetime.now(), data['created_by'], data['rating'],
                         ddg_info.abstract.text, ddg_info.abstract.source, ddg_info.abstract.url, ddg_info.image.url) )
    dvd = cursor.fetchone()
    db.commit()
    cursor.close()
    return dvd
  except psycopg2.IntegrityError as e:
    db.rollback()
    cursor.close()
    if (e.pgcode == '23505'):
      return {"created_by": "error", "title": data['title'] + " already exists."}
    else:
      return False

def get_ddg_info(data):
  r = duckduckgo.query(data['title'])

  if (r.image):
    image_file = r.image.url.split('/')[-1]
  else:
    image_file = ''

  try:
    response = urllib2.urlopen(r.image.url)
    image_output = open('static/images/' + image_file, 'w')
    image_output.write(response.read())
    image_output.close()
  
    r.image.url = 'images/' + image_file
  except ValueError:
    r.image.url = ''
  except AttributeError:
    r.image = lambda: None
    setattr(r.image, 'url', '')

  return r

def update_dvd(dvd_id, data):
  try:
    db = get_db()
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("update dvds set rating = %s where id = %s", (data['rating'], dvd_id ));
    cursor.execute("update dvds set title = %s where id = %s", (data['title'], dvd_id ));
    cursor.execute("update dvds set created_by = %s where id = %s", (data['created_by'], dvd_id ));
    cursor.execute("update dvds set abstract = %s where id = %s", (data['abstract_txt'], dvd_id ));
    cursor.execute("update dvds set abstract_source = %s where id = %s", (data['abstract_source'], dvd_id ));
    cursor.execute("update dvds set abstract_url = %s where id = %s", (data['abstract_url'], dvd_id ));
    cursor.execute("update dvds set image_url = %s where id = %s", (data['image_url'], dvd_id ));
    cursor.execute("update dvds set file_url = %s where id = %s", (data['file_url'], dvd_id ));
    db.commit()
    cursor.close()

    return find_by_id(dvd_id)
  except psycopg2.IntegrityError as e:
    db.rollback()
    cursor.close()
    if (e.pgcode == '23505'):
      return {"created_by": "error", "title": data['title'] + " already exists.", "rating": data['rating'], "id": dvd_id}
    else:
      return False

def delete_dvd(dvd_id):
  db = get_db()
  cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  cursor.execute("delete from dvds where id = %s;", [dvd_id])
  cursor.close()
  return db.commit()

def get_playback_location(dvd_id):
  db = get_db()
  cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  cursor.execute("select playback_time from dvds where id = %s;", [dvd_id])
  playback_time = cursor.fetchone()['playback_time']
  cursor.close()
  return playback_time

def set_playback_location(dvd_id, playback_time):
  db = get_db()
  cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  cursor.execute("update dvds set playback_time = %s where id = %s;", (dvd_id, playback_time))
  db.commit()
  cursor.close()
  return True

# Routes
@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

@app.route('/dvds', methods=['GET', 'POST'])
def find_all():
  if (request.method == 'GET'):
    dvds = {'dvds': find_all_dvds()}
    return json.dumps(dvds)
  elif (request.method == 'POST'):
    dvd = add_dvd(json.loads(request.data)['dvd'])
    return json.dumps({"dvd": dvd})

@app.route('/dvds/<int:dvd_id>', methods=['GET', 'PUT', 'POST', 'DELETE'])
def show_dvd(dvd_id):
  if (request.method == 'GET'):
    # Show the DVD with the given id, the id is an integer.
    return json.dumps({ "dvd": find_by_id(dvd_id) })
  elif (request.method == 'PUT'):

    status = update_dvd(dvd_id, json.loads(request.data)['dvd'])
    return json.dumps({"dvd": status})
  elif (request.method == 'POST'):
    # Handle the image file upload.
    file = request.files['file']
    if file and allowed_file(file.filename):
      filename = secure_filename(file.filename)
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
      return json.dumps(True)
    else:
      return json.dumps(False), 500

  elif (request.method == 'DELETE'):
    delete_dvd(dvd_id)
    return json.dumps(True)

@app.route('/dvds/search/<query>', methods=['GET'])
def search(query):
  if (request.method == 'GET'):
    return json.dumps({ "dvds": find_by_title(query) })

@app.route('/dvds/playback/<int:dvd_id>', methods=['GET', 'POST'])
def play_dvd(dvd_id):
  if (request.method == 'GET'):
    playback_time = get_playback_location(dvd_id)
    return json.dumps(int(get_playback_location(dvd_id)))
  elif (request.method == 'POST'):
    return json.dumps(set_playback_location(request.form.get('playback_time'), dvd_id))


def allowed_file(filename):
  return '.' in filename and \
    filename.rsplit('.', 1)[1] in config.get('Server', 'allowed_ext')


if __name__ == '__main__':
  app.run()

