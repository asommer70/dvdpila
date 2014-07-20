#!/usr/bin/python
#
# Test parting Duck Duck Go search results for the movie Superbad.
#

import datetime, time
import json
import psycopg2, psycopg2.extras

import duckduckgo
import urllib2


#r = duckduckgo.query('Superbad (film)')
#print r.type
#print r.heading
## Results page: https://duckduckgo.com/?q=Superbad
#print r.abstract.text
#print r.abstract.source
#print r.abstract.url
#print r.image.url
#r.image.url = "static/images/" + r.image.url.split('/')[-1]
#print r.image.url

def add_dvd_attr(title):
  conn = psycopg2.connect(database="", user="", password="", host="")
  cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

  ddg_info = get_ddg_info(title) 

  try:
    cursor.execute("""
                   update dvds set abstract = %s, 
                               abstract_source = %s, 
                               abstract_url = %s, 
                               image_url = %s
                   where title = %s;
                   """, (ddg_info.abstract.text, ddg_info.abstract.source, ddg_info.abstract.url, ddg_info.image.url, title) )
    #dvd = cursor.fetchone()
    conn.commit()
    cursor.close()
    return True
    #return dvd
  except psycopg2.IntegrityError as e:
    conn.rollback()
    cursor.close()
    print "e.pgcode: ", e.pgcode
    if (e.pgcode == '23505'):
      return {"created_by": "error", "title": data['title'] + " already exists."}
    else:
      return False

def get_ddg_info(title):
  r = duckduckgo.query(title + " (film)")
  print r.image.url

  try:
    image_file = r.image.url.split('/')[-1]

    response = urllib2.urlopen(r.image.url)
    image_output = open('static/images/' + image_file, 'w')
    image_output.write(response.read())
    image_output.close()

    r.image.url = 'images/' + image_file
    print
    print r.abstract.source, r.abstract.url, r.image.url, title
    print
    print r.abstract.text
  except ValueError:
    print "No Image URL for: ", title

    print r.abstract.source, r.abstract.url, r.image.url, title
    print r.abstract.text

  return r

dvd = {
  "title": "Superbad",
  "created_by": "Adam",
  "rating": 5
}

get_ddg_info("Inglourius Basterds")
