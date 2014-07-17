#!/usr/bin/python
#
# Grab dvdpila tagged posts from the Codepen RSS feed and create markdown files.
#

import feedparser
import datetime

d = feedparser.parse('http://codepen.io/asommer70/blog/feed/')

for post in d.entries:
  #print post.title, post.description

  # Check for Ember in the post.description.
  try:
    # Get today's post and check for key words.
    ember_index = post.description.index('Ember')
    post_date = datetime.datetime.strptime(post.date[:-6], "%Y-%m-%dT%H:%M:%S")
    slug = post.title.replace(' ', '-').lower()
    file_name = post_date.strftime("%Y-%m-%d-" + slug.replace('...', '')) + ".markdown"
    
    print file_name, slug, post_date

    header = """---
layout: post
title:  "%s"
date:   %s
categories: emberjs
---

""" % (post.title, post_date.strftime("%Y-%m-%d %H:%m:%S"))

    #post_file = open("blog/_posts/" + file_name, 'w')
    #post_file.write(header + post.description + "\n")

    #print post.title, post.date
  except ValueError:
    #print post.date
    pass
