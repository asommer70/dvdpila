#!/usr/bin/python

from flask import Flask, request, redirect, url_for, send_from_directory, g
from werkzeug.utils import secure_filename
import os.path

import datetime, time
import json
import psycopg2, psycopg2.extras
import duckduckgo
import urllib2
import decimal

import ConfigParser, os

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# Read the config.cfg file.
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
config = ConfigParser.ConfigParser()
config.readfp(open(os.path.join(__location__, 'config.cfg')))


# Setup SQLAlchemy database connection and table class.
engine = create_engine('postgresql://adam:pivo70@localhost/dvdsdb')
engine = create_engine('postgresql://' + config.get('Database', 'db_user') + ':' + config.get('Database', 'db_pass') + 
                       '@' +  config.get('Database', 'host') + '/' + config.get('Database', 'db'))
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

class Dvd(Base):
  __tablename__ = 'dvds'

  id = Column(Integer, primary_key=True)
  title = Column(String)
  created_at = Column(DateTime)
  created_by = Column(String)
  rating = Column(Integer)
  abstract = Column(String)
  abstract_source = Column(String)
  abstract_url = Column(String)
  image_url = Column(String)
  file_url = Column(String)
  playback_time = Column(Integer)


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
  #db = get_db()
  #cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  #cursor.execute("""
  #               select id, title, created_by, rating, extract(epoch from created_at) as created_at, 
  #                      abstract as abstract_txt, abstract_source, abstract_url, image_url, file_url
  #               from dvds where id = %s;
  #               """ % (id))
  #dvd = cursor.fetchone()
  #cursor.close()
  #return dvd

  q = session.query(Dvd).get(id)
  return jsonable(Dvd, q) 

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
  # Add new object.
  new_dvd = json.loads(request.data)
  dvd = Dvd()

  # Set the SQLAlchemy object's attributes.
  for key, value in new_dvd['dvd'].iteritems():
    setattr(dvd, key, value)

  ddg_info = get_ddg_info(data)
  dvd.abstract = ddg_info.abstract.text
  dvd.abstract_source = ddg_info.abstract.source
  dvd.abstract_url = ddg_info.abstract.url
  dvd.image_url = ddg_info.image.url

  dvd.created_at = datetime.datetime.now()

  session.add(dvd)
  session.commit()

  # Might find a better way to return the new DVD.
  return {"dvd": {
      "id": dvd.id, 
      "title": dvd.title, 
      "created_at": dvd.created_at.strftime("%Y-%m-%d %H:%M:%S"),
      "created_by": dvd.created_by,
      "rating": dvd.rating, 
      "abstract": dvd.abstract, 
      "abstract_source": dvd.abstract_source, 
      "abstract_url": dvd.abstract_url, 
      "image_url": dvd.image_url, 
    }
  }

def get_ddg_info(data):
  try: 
    r = duckduckgo.query(data['title'])
  except:
    # Can't connect to the Internet so build a blank object.
    r = lambda: None
    r.image = lambda: None
    r.abstract = lambda: None
    setattr(r.abstract, 'text', '')
    setattr(r.abstract, 'source', '')
    setattr(r.abstract, 'url', '')
    setattr(r.image, 'url', '')

  if (r.image):
    image_file = r.image.url.split('/')[-1]
  else:
    image_file = ''

  try:
    response = urllib2.urlopen(r.image.url)
    image_output = open(os.path.join(__location__, app.config['UPLOAD_FOLDER'], image_file), 'w')
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
  if not (playback_time):
    playback_time = 0
  cursor.close()
  return playback_time

def set_playback_location(dvd_id, playback_time):
  db = get_db()
  cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
  cursor.execute("update dvds set playback_time = %s where id = %s;", (dvd_id, playback_time))
  db.commit()
  cursor.close()
  return True

def find_all(sql_obj):
  """
  Return a list of all records in the table.
  """
  q = session.query(sql_obj)
  return jsonable(sql_obj, q)


# Routes
@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

@app.route('/dvds', methods=['GET', 'POST'])
def dvds():
  if (request.method == 'GET'):
    return json.dumps({"dvds": find_all(Dvd)})
  elif (request.method == 'POST'):
    dvd = add_dvd(json.loads( request.data)['dvd'])
    return json.dumps(dvd)

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
      file.save(os.path.join(__location__, app.config['UPLOAD_FOLDER'], filename))
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

def jsonable(sql_obj, query_res):
  """
  Return a list of dictionaries from query results since SQLAlchemy 
  query results can't be serialized into JSON evidently.
  """
  cols = sql_obj.__table__.columns
  col_keys = [col.key for col in cols]

  # If not Query object put it in a list.
  if (query_res.__class__.__name__ != 'Query'):
    query_res = [query_res]

  obj_list = []
  for obj in query_res:
    obj_dict = {}
    for key, value in obj.__dict__.iteritems():
      if (key in col_keys):
        if (type(value) == datetime.datetime):
          value = value.strftime("%Y-%m-%d %H:%M:%S")
        elif (type(value) == decimal.Decimal):
          value = int(value)
        obj_dict[key] = value 
    if (query_res.__class__.__name__ == 'Query'):
      obj_list.append(obj_dict)

  if (query_res.__class__.__name__ != 'Query'):
    return obj_dict
  else:
    return obj_list

#def find_all_new(sql_obj):
#  """
#  Return a list of all records in the table.
#  """
#  q = session.query(sql_obj)
#  return jsonable(sql_obj, q)

def find_by_id_new(id):
  q = session.query(Dvd).get(id)
  return { "dvd": jsonable(Dvd, q) }

if __name__ == '__main__':
  app.run()

