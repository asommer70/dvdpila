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
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship, backref
from sqlalchemy.exc import IntegrityError
from sqlalchemy.exc import InvalidRequestError


# Read the config.cfg file.
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
config = ConfigParser.ConfigParser()
config.readfp(open(os.path.join(__location__, 'config.cfg')))


# Setup SQLAlchemy database connection and table class.
engine = create_engine('postgresql://' + config.get('Database', 'db_user') + ':' + config.get('Database', 'db_pass') + 
                       '@' +  config.get('Database', 'host') + '/' + config.get('Database', 'db'))
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

association_table = Table(
  'dvds_tags', Base.metadata,
  Column('dvd_id', Integer, ForeignKey('dvds.id')),
  Column('tag_id', Integer, ForeignKey('tags.id'))
)

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
  episodes = relationship("Episode", lazy="joined")
  tags = relationship("Tag", secondary=association_table, backref="dvds")
  bookmarks = relationship("Bookmark", lazy="joined")

class Episode(Base):
  __tablename__ = 'episodes'

  id = Column(Integer, primary_key=True)
  name = Column(String)
  episode_file_url = Column(String)
  playback_time = Column(Integer)
  dvd_id = Column(Integer, ForeignKey('dvds.id'))
  bookmarks = relationship("Bookmark", lazy="joined")

class Tag(Base):
  __tablename__ = 'tags'

  id = Column(Integer, primary_key=True)
  name = Column(String)

class Bookmark(Base):
  __tablename__ = 'bookmarks'

  id = Column(Integer, primary_key=True)
  name = Column(String)
  time = Column(Integer)
  dvd_id = Column(Integer, ForeignKey('dvds.id'))
  episode_id = Column(Integer, ForeignKey('episodes.id'))


# Setup Flask app.
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = config.get('Server', 'upload_folder')
app.debug = config.getboolean('Server', 'debug')


# Model functions.
def find_by_id(id):
  dvd = session.query(Dvd).get(id)
  dvd_json = jsonable(Dvd, dvd)
  episodes = []
  tags = []
  bookmarks = []

  for episode in dvd.episodes:
    epi_json = jsonable(Episode, episode)
    episodes.append(epi_json)

  for tag in dvd.tags:
    tag_json = jsonable(Tag, tag)
    tags.append(tag_json)

  for bookmark in dvd.bookmarks:
    bookmark_json = jsonable(Bookmark, bookmark)
    bookmarks.append(bookmark_json)

  dvd_json["episodes"] = [episode.id for episode in dvd.episodes]
  dvd_json["tags"] = [tag.id for tag in dvd.tags]
  dvd_json["bookmarks"] = [bookmark.id for bookmark in dvd.bookmarks]

  return {"dvd": dvd_json, "episodes": episodes, "tags": tags, "bookmarks": bookmarks}

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

  del data['search']
  for key in data:
    if (key != 'tags'):
      setattr(dvd, key, data[key])
    else:
      # Get tags from ID list.
      tags = []
      for tag_id in data['tags']:
        tags.append(session.query(Tag).get(tag_id))
      dvd.tags = tags

  try:
    session.commit()
  except InvalidRequestError:
    session.rollback()

  return find_by_id(dvd_id)

def delete_dvd(dvd_id):
  dvd = session.query(Dvd).get(dvd_id)
  session.delete(dvd)
  session.commit()

  return True

def get_playback_location(sql_obj, vid_id):
  vid = session.query(sql_obj).get(vid_id)

  return vid.playback_time

def set_playback_location(sql_obj, vid_id, playback_time):
  vid = session.query(sql_obj).get(vid_id)
  vid.playback_time = playback_time

  session.commit()
  return True

def find_all():
  """
  Return a list of all records in the table.
  """
  q = session.query(Dvd)
  dvds = []
  episodes = []
  tags = []

  # Sideload the episodes.
  for dvd in q:
    dvd_json = jsonable(Dvd, dvd)
    for episode in dvd.episodes:
      epi_json = jsonable(Episode, episode)
      episodes.append(epi_json)

    dvd_json["episodes"] = [episode.id for episode in dvd.episodes]

    for tag in dvd.tags:
      tag_json = jsonable(Tag, tag)
      tags.append(tag_json)

    dvd_json["episodes"] = [episode.id for episode in dvd.episodes]
    dvd_json["tags"] = [tag.id for tag in dvd.tags]
    dvds.append(dvd_json)

  return {"dvds": dvds, "episodes": episodes, "tags": tags}

def find_all_tags():
  """
  Return a list of all Tags.
  """
  tags = session.query(Tag)
  return jsonable(Tag, tags)

def find_all_bookmarks():
  """
  Return a list of all Bookmarks.
  """
  bookmarks = session.query(Bookmark)
  return jsonable(Bookmark, bookmarks)


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

def add_tag(data):
  # Add new object.
  tag = Tag()

  # Set the SQLAlchemy object's attributes.
  tag.name = data['name']

  try:
    session.add(tag)
    session.commit()
  except IntegrityError:
    session.rollback()

  return {"tag": {
      "id": tag.id, 
      "name": tag.name, 
    }
  }

def add_bookmark(data):
  # Add new object.
  bookmark = Bookmark()

  print data

  # Set the SQLAlchemy object's attributes.
  bookmark.name = data['name']
  bookmark.time = data['time']
  bookmark.dvd_id = data['dvd_id']
  bookmark.episode_id = data['episode_id']

  try:
    session.add(bookmark)
    session.commit()
  except IntegrityError:
    session.rollback()

  return {"bookmark": {
      "id": bookmark.id,
      "name": bookmark.name,
      "time": int(bookmark.time),
      "dvd_id": bookmark.dvd_id,
      "episode_id": bookmark.episode_id,
    }
  }

def find_tag_by_name(name):
  # Search by regex.
  try: 
    tag = session.query(Tag).filter("name = '%s'" % (name)).all()[0]
    return jsonable(Tag, tag)
  except IndexError:
    return { "id": 0, "name": False }


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

    if (yoopsie_data[1]):

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
      dvd.rating = 1

      # Use the Yoopsie image if Duck Duck Go doesn't find anything.
      if (dvd.image_url == ''):
        image_file = yoopsie_data[0].split('/')[-1]
        response = urllib2.urlopen(yoopsie_data[0])
        image_output = open(os.path.join(__location__, app.config['UPLOAD_FOLDER'], image_file), 'w')
        image_output.write(response.read())
        image_output.close()
  
        dvd.image_url = 'images/' + image_file

      try:
        session.add(dvd)
        session.commit()

        return_data = {
          "status": "DVD Created...",
          "openUrl": "http://192.168.1.22:5000/#/" + str(dvd.id)
        }
        return json.dumps(return_data)
      except IntegrityError:
        session.rollback()
        return_data = {
          "status": "DVD Previously Created...",
          "openUrl": "http://192.168.1.22:5000/#/"
        }
        return json.dumps(return_data)

    else:
      return_data = {
        "status": "DVD *NOT* Created...",
        "openUrl": "http://192.168.1.22:5000/#/"
      }
      return json.dumps(return_data)

@app.route('/dvds', methods=['GET', 'POST'])
def dvds():
  if (request.method == 'GET'):
    #return json.dumps({"dvds": find_all(Dvd)})
    #return json.dumps(find_all(Dvd))
    return json.dumps(find_all())
  elif (request.method == 'POST'):
    dvd = add_dvd(json.loads( request.data)['dvd'])
    return json.dumps(dvd)

@app.route('/dvds/<int:dvd_id>', methods=['GET', 'PUT', 'POST', 'DELETE'])
def show_dvd(dvd_id):
  if (request.method == 'GET'):
    # Show the DVD with the given id, the id is an integer.
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
    #playback_time = get_playback_location(Dvd, dvd_id)
    return json.dumps(int(get_playback_location(Dvd, dvd_id)))
  elif (request.method == 'POST'):
    return json.dumps(set_playback_location(Dvd, dvd_id, request.form.get('playback_time')))

@app.route('/episodes', methods=['GET', 'POST'])
def episodes():
  if (request.method == 'GET'):
    return json.dumps({"episodes": find_all()})
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

@app.route('/episodes/playback/<int:episode_id>', methods=['GET', 'POST'])
def play_episode(episode_id):
  if (request.method == 'GET'):
    playback_time = get_playback_location(Episode, episode_id)
    return json.dumps(int(get_playback_location(Episode, episode_id)))
  elif (request.method == 'POST'):
    return json.dumps(set_playback_location(Episode, episode_id, request.form.get('playback_time')))

@app.route('/tags', methods=['GET', 'POST'])
def tags():
  if (request.method == 'GET'):

    if (request.args.get('name')):
      return json.dumps({"tags": [find_tag_by_name(request.args.get('name'))] })
    else:
      return json.dumps({"tags": find_all_tags()})
  elif (request.method == 'POST'):
    tag = add_tag(json.loads( request.data)['tag'])
    return json.dumps(tag)

@app.route('/bookmarks', methods=['GET', 'POST'])
def bookmarks():
  if (request.method == 'GET'):
    return json.dumps({"bookmarks": find_all_bookmarks()})
  elif (request.method == 'POST'):
    bookmark = add_bookmark(json.loads( request.data)['bookmark'])
    return json.dumps(bookmark)


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
  child_name = sql_obj.episodes[0].__class__.__name__.lower() + "s"

  obj_json[child_name] = []
  for child in sql_obj.episodes:
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
  try:
    return (items[0].a.img['src'], items[0].a['title'])
  except IndexError:
    return (False, False)

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

