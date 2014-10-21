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
from bs4 import BeautifulSoup

import ConfigParser, os

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship, backref


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
  abstract_txt = Column(String)
  abstract_source = Column(String)
  abstract_url = Column(String)
  image_url = Column(String)
  file_url = Column(String)
  playback_time = Column(Integer)
  children = relationship("Episode", lazy="joined")

class Episode(Base):
  __tablename__ = 'episodes'

  id = Column(Integer, primary_key=True)
  name = Column(String)
  episode_file_url = Column(String)
  dvd_id = Column(Integer, ForeignKey('dvds.id'))


# Setup Flask app.
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = config.get('Server', 'upload_folder')
app.debug = config.getboolean('Server', 'debug')


# Model functions.
def find_by_id(id):
  q = session.query(Dvd).get(id)
  dvd_json = jsonable(Dvd, q) 
  episodes = []
  for child in q.children:
    epi_json = jsonable(Episode, child)
    #epi_json['dvd'] = epi_json['dvd_id']
    episodes.append(epi_json)

  dvd_json["episodes"] = [child.id for child in q.children]

  return {"dvd": dvd_json, "episodes": episodes}

def find_episode(id):
  q = session.query(Episode).get(id)
  epi_json = jsonable(Episode, q) 

  return {"episode": epi_json}

def find_by_title(title):
  # Search by regex.
  dvds = session.query(Dvd).filter("title ~* '%s'" % (title)).all()
  json_dvds = []
  for dvd in dvds:
    json_dvds.append(jsonable(Dvd, dvd))

  return json_dvds

def add_dvd(data):
  # Add new object.
  new_dvd = json.loads(request.data)
  dvd = Dvd()

  # Set the SQLAlchemy object's attributes.
  for key, value in new_dvd['dvd'].iteritems():
    setattr(dvd, key, value)

  ddg_info = get_ddg_info(data)
  dvd.abstract_txt = ddg_info.abstract.text
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
      "abstract_txt": dvd.abstract_txt,
      "abstract_source": dvd.abstract_source, 
      "abstract_url": dvd.abstract_url, 
      "image_url": dvd.image_url, 
    }
  }

def update_dvd(dvd_id, data):
  # Rename abstract column:
  # ALTER TABLE dvds RENAME COLUMN abstract TO abstract_txt;

  dvd = session.query(Dvd).get(dvd_id)

  for key in data:
    setattr(dvd, key, data[key])

  session.commit()
  return find_by_id(dvd_id)

def delete_dvd(dvd_id):
  dvd = session.query(Dvd).get(dvd_id)
  session.delete(dvd)
  session.commit()

  return True

def get_playback_location(dvd_id):
  dvd = session.query(Dvd).get(dvd_id)

  return dvd.playback_time

def set_playback_location(dvd_id, playback_time):
  dvd = session.query(Dvd).get(dvd_id)
  dvd.playback_time = playback_time

  session.commit()
  return True

def find_all(sql_obj):
  """
  Return a list of all records in the table.
  """
  q = session.query(sql_obj)
  return jsonable(sql_obj, q)

def add_episode(data):
  # Add new object.
  episode = Episode()

  # Set the SQLAlchemy object's attributes.
  #print data
  episode.name = data['name']
  episode.episode_file_url = data['episode_file_url']
  episode.dvd_id = data['dvd_id']

  session.add(episode)
  session.commit()

  return {"episode": {
      "id": episode.id, 
      "name": episode.name, 
      "episode_file_url": episode.episode_file_url, 
      "dvd_id": episode.dvd_id,
    }
  }

def update_episode(episode_id, data):
  """
  Update episode.
  """
  episode = session.query(Episode).get(episode_id)
  #print data

  for key in data['episode']:
    setattr(episode, key, data['episode'][key])

  session.commit()
  return find_episode(episode_id)

def delete_episode(episode_id):
  episode = session.query(Episode).get(episode_id)
  session.delete(episode)
  session.commit()

  return True

# Routes
@app.route('/', methods=['GET'])
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

@app.route('/barcode/', methods=['POST'])
def barcode():
  if (request.method == 'GET'):
    return json.dumps(True)
  elif (request.method == 'POST'):
    data = json.loads(request.data)

    yoopsie_data = get_yoopsie(data['barcode'])

    #get_ddg_info(data):

    dvd = Dvd()


    ddg_info = get_ddg_info(yoopsie_data[1])
    dvd.abstract_txt = ddg_info.abstract.text
    dvd.abstract_source = ddg_info.abstract.source
    dvd.abstract_url = ddg_info.abstract.url
    dvd.image_url = ddg_info.image.url

    dvd.created_at = datetime.datetime.now()

    dvd.title = yoopsie_data[1]
    dvd.created_by = "barcode"

    # Use the Yoopsie image if Duck Duck Go doesn't find anything.
    if (dvd.image_url == ''):
      image_file = yoopsie_data[0].split('/')[-1]
      response = urllib2.urlopen(yoopsie_data[0])
      image_output = open(os.path.join(__location__, app.config['UPLOAD_FOLDER'], image_file), 'w')
      image_output.write(response.read())
      image_output.close()
  
      dvd.image_url = 'images/' + image_file

    session.add(dvd)
    session.commit()

    return_data = {
      "status": "DVD Created...",
      #"yoopsieImage": yoopsie_data[0],
      #"yoopsieUrl": yoopsie_data[1],
      "openUrl": "http://192.168.1.22:5000/#/" + str(dvd.id)
    }

    #print return_data

    return json.dumps(return_data)

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
    #return json.dumps(find_by_id(dvd_id))
    return app.response_class(json.dumps(find_by_id(dvd_id)), mimetype='application/json')
  elif (request.method == 'PUT'):

    status = update_dvd(dvd_id, json.loads(request.data)['dvd'])
    #print status
    #return json.dumps({"dvd": status})
    return json.dumps(status)
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
    return json.dumps(set_playback_location(dvd_id, request.form.get('playback_time')))

@app.route('/episodes', methods=['GET', 'POST'])
def episodes():
  if (request.method == 'GET'):
    return json.dumps({"episodes": find_all(Episode)})
  elif (request.method == 'POST'):
    episode = add_episode(json.loads( request.data)['episode'])
    return json.dumps(episode)

@app.route('/episodes/<int:episode_id>', methods=['GET', 'PUT', 'POST', 'DELETE'])
def episode(episode_id):
  if (request.method == 'GET'):
    pass
  elif (request.method == 'POST'):
    pass
  elif (request.method == 'PUT'):
    episode = update_episode(episode_id, json.loads(request.data))
    return app.response_class(json.dumps(episode), mimetype='application/json')
  elif (request.method == 'DELETE'):
    delete_episode(episode_id)
    return json.dumps(True)



# Helpers
def allowed_file(filename):
  return '.' in filename and \
    filename.rsplit('.', 1)[1] in config.get('Server', 'allowed_ext')

def jsonable(sql_obj, query_res):
  """
  Return a list of dictionaries from query results since SQLAlchemy 
  query results can't be serialized into JSON evidently.
  """
  cols = sql_obj.__table__.columns
  #print cols
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

def jsonable_children(obj_json, sql_class, sql_obj):
  child_name = sql_obj.children[0].__class__.__name__.lower() + "s"

  obj_json[child_name] = []
  for child in sql_obj.children:
    obj_json[child_name].append(jsonable(sql_class, child))

  return obj_json

def get_yoopsie(barcode):
  """
  Query the Yoopsie website and grab the image for the barcode.
  """
  url = "http://www.yoopsie.com/query.php?query=" + barcode
  
  response = urllib2.urlopen(url)
  
  html = response.read()
  
  soup = BeautifulSoup(html)
  
  items = soup.find_all("td", class_='info_image')
  #items[0].a.img['src']
  #items[0].a['title']
  
  #return (items[0].a.img['src'], "https://duckduckgo.com/?q=" + items[0].a['title'])
  return (items[0].a.img['src'], items[0].a['title'])

def get_ddg_info(title):
  try: 
    r = duckduckgo.query(title)
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



if __name__ == '__main__':
  app.run(host='0.0.0.0')

