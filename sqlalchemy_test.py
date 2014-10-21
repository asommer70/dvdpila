#!/usr/bin/python
#
# Testing SQLAlchemy against dvdsdb.dvds table.
#

#import sqlalchemy
import datetime

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship, backref

import decimal

#engine = create_engine('postgresql://adam:pivo70@localhost/dvdsdb')
engine = create_engine('postgresql://adam:pivo70@localhost/dvdpila')
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

from collections import OrderedDict
import json

class DictSerializable(object):
  def _asdict(self):
    result = OrderedDict()
    for key in self.__mapper__.c.keys():
      result[key] = getattr(self, key)
      return result

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

class Episode(Base):
  __tablename__ = 'episodes'

  id = Column(Integer, primary_key=True)
  name = Column(String)
  episode_file_url = Column(String)
  dvd_id = Column(Integer, ForeignKey('dvds.id'))

class Tag(Base):
  __tablename__ = 'tags'

  id = Column(Integer, primary_key=True)
  name = Column(String)

# Add new object.
#super_bad = Dvd(title='Super Bad', created_at=datetime.datetime.now(), created_by='adam', rating=5, file_url='')
#session.add(super_bad)

#session.commit()

#q = session.query(Dvd.columns['title', 'created_at', 'created_by', 'rating', 'file_url']);
#cols = Dvd.__table__.columns
#col_keys = [col.key for col in cols]
#print col_keys
#
#q = session.query(Dvd)
##print q.__dict__
#dvds = []
#for dvd in q:
#  #print dvd
#  dvd_dict = {}
#  for key, value in dvd.__dict__.iteritems():
#    if (key in col_keys):
#      if (type(value) == datetime.datetime):
#        value = value.strftime("%Y-%m-%d %H:%M:%S")
#      dvd_dict[key] = value 
#  dvds.append(dvd_dict)
#  #print json.dumps(dvd)
#
#print json.dumps(dvds)


### Querying All
#dvd_json = json.loads('{"dvd": {"rating": 1, "created_at": "2014-08-23T11:51:16.235Z", "file_url": "", "created_by": "adam", "title": "test"}}')

#print dir(Dvd())
#dvd = Dvd()

#for key, value in dvd_json['dvd'].iteritems():
  #setattr(dvd, key, value)

#print dvd.title
#print dvd.rating
#session.add(dvd)

#session.commit()

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


def jsonable_episodes(obj_json, sql_class, sql_obj):
  child_name = sql_obj.episodes[0].__class__.__name__.lower() + "s"

  obj_json[child_name] = []
  for child in sql_obj.episodes:
    obj_json[child_name].append(jsonable(sql_class, child))

  return obj_json

### Querying 1 by id
#dvd = session.query(Dvd).join(Episode)

dvd = session.query(Dvd).get(29)

print dvd.title, dvd.id, dvd.tags[0].name

tag = session.query(Tag).get(1)
print tag.name, tag.dvds[0].title

#dvd = session.query(Dvd).get(41)
#
#print dir(dvd)
#print 
#print dir(dvd.episodes)
#print
#print dvd.episodes[0].__class__.__name__.lower() + "s"
#print
#print
#dvd_json = jsonable(Dvd, dvd)
#dvd_json = jsonable_episodes(dvd_json, Episode, dvd)
#print dvd_json
#

#title = "game"
#dvds = session.query(Dvd).filter("title ~* '%s'" % (title)).all()

#jsons = []
#for dvd in dvds:
#  print dir(dvd)
#  print dvd.title
#  jsons.append(jsonable(Dvd, dvd))

#print jsons

#key = 'rating'
#print dir(dvd)
#dvd.rating = 3
#dvd.key = 5
#setattr(dvd, key, 5)
#session.add(dvd)
#dvd.rating = 4
#session.commit()
