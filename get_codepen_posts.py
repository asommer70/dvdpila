#!/usr/bin/python
#
# Grab dvdpila tagged posts from the Codepen RSS feed and create markdown files.
#

import feedparser
import datetime
import os.path

d = feedparser.parse('http://codepen.io/asommer70/blog/feed/')

for post in d.entries:
  #print post.title, post.description

  # Check for Ember in the post.description.
  print post.date
  try:
    # Get some date stuff from the Codepen post.
    post_date = datetime.datetime.strptime(post.date[:-6], "%Y-%m-%dT%H:%M:%S")
    post_date_day = post_date.strftime("%Y-%m-%d")

    # Get today's post and check for key words.
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    try:
      ember_index = post.description.index('Ember')
    except ValueError:
      ember_index = False
    try: 
      jekyll_index = post.description.index('Jekyll')
    except ValueError:
      jekyll_index = False
    try: 
      dvdpila_index = post.description.index('dvdpila')
    except ValueError:
      dvdpila_index = False

    if (today == post_date_day and ember_index or jekyll_index or dvdpila_index):

      slug = post.title.replace(' ', '-').lower()
      file_name = post_date.strftime("%Y-%m-%d-" + slug.replace('...', '').replace('!', '')) + ".markdown"
      
      #print file_name, slug, post_date

      header = """---
layout: post
title:  "%s"
date:   %s
categories: emberjs
---
<div class="post-inner">

"""   % (post.title, post_date.strftime("%Y-%m-%d %H:%m:%S"))

      # Don't overwrite the file if it exists.
      if not (os.path.isfile("_posts/" + file_name):
        print "writing: ", "_posts/" + filename
        post_file = open("_posts/" + file_name, 'w')

        # Change the extra </span> at the end of the description to a </div> and write the file.
        post_file.write(header + post.description[:-7] + "</div>\n")

    #print post.title, post.date
  except ValueError:
    print "error: ", post.date
    pass
