---
layout: post
title:  "Python and Duck Duck Go"
date:   2014-07-12 06:07:54
categories: emberjs
---

<p>Did some late night work and tried to find an API for IMDB in order to gather more information on the DVDs I own.  I guess they don't have an official API, and the only thing I found was a StackOverflow thread about using it through JSONP.</p>

<p>There does seem to be a couple of alternative databases of movies that could work for what I'm needed, but none of them looked to up to date to me.  My next thought was to use the Duck Duck Go search engine and parse it's API for the info I need.  The documentation for the "Instant Answer" <a href="https://duckduckgo.com/api" rel="nofollow">API</a> is very good.</p>

<p>I think looked for a Python library that I could integrate with my Flask server, and found <a href="https://github.com/crazedpsyc/python-duckduckgo" rel="nofollow">this</a> great project on Github.  The library is very easy to use and I was able to find the information I need in a short amount of time.  I then adjusted a test script to query the database and update some new fields in the table.  </p>

<p>I then ran into a slight problem with using a search engine.  If there are multiple things with the same title my script doesn't account for that.  So for movies like <em>The Fellowship of The Ring</em> Duck Duck Go will also return entries for the book.  I could make the script a smarter and account for similar search results, but I think the better solution is to make the new fields editable.  That way if a user doesn't like the pic in Wikipedia they can upload their own.</p>

<p>So it'll be learning how to upload files in Ember.js for me...</p>

<p>Party On!</p>
</span>
