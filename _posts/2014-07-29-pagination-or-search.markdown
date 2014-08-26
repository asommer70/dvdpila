---
layout: post
title:  "Pagination or Search"
date:   2014-07-29 15:07:42
excerpt: <p><img alt="to search or not to search" class="post-image" src="http://www.thehoick.com/images/search_or_pagination.jpg"/></p>
categories: emberjs
---
 

<p><img alt="to search or not to search" class="post-image" src="http://www.thehoick.com/images/search_or_pagination.jpg" /></p>

<p>Finally had a chance to get back to my Ember.js project today.  Still bashing my head against the error I get when adding a record to the paginated collection.</p>

<p>I've tried removing all the custom code I've found around the web.  I removed the star rating, moved the "add new DVD" functionality into it's own page instead of including it as a hidden form on the main page, and also removed all the pagination code and double checked that things worked without it.</p>

<p>It wasn't until I removed the search functionality wich sets the controller <em>arrangedContent</em> attribute, and tried adding a new record that I made another step forward.  If both pagination and search are implemented things go bonkers when adding a record.  Disable one or the other and things work just fine and dandy.</p>

<p>The angle I'm working on to solve this little pickle is to move the search to the server using some <a href="http://www.postgresql.org/docs/9.3/static/functions-matching.html" rel="nofollow">PostgreSQL pattern matching</a> and send back the results via JSON.  This should allow me to move the search field into the navigation menu instead of having it at the top of the main content area.  If I can get it working I think it'll be pretty cool.</p>

<p>Party On!</p>

<p>[dvdpila]</p>
 
