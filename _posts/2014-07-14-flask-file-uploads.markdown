
---
layout: post
title:  "Flask File Uploads"
date:   2014-07-14 13:07:20
categories: emberjs
---

<p><img alt="flask doc screenshot" src="http://www.thehoick.com/images/flask_upload.png" /></p>

<p>Figured out my problem with uploading an image file to my Flask server this morning.  Turns out you have to grab the actual input field and not the Ember model binding for that input field.</p>

<p>The interesting thing about the Ember binding of the file input field is that it grabbed the binary data of the image.  So that confused me for a while.  Once I used some straight jQuery to grab the input element I was able to get the appropriate fields for name, type, etc and the upload worked as all the <a href="http://flask.pocoo.org/docs/patterns/fileuploads/" rel="nofollow">tutorials</a> I read worked.</p>

<p>I next ran into a small issue with the size of the <em>varchar</em> abstract_url field that contains the link to where the information about the DVD came from.  Turns out that if you get that information from Amazon, which is a great place to find info about DVDS, you can run into <a href="http://www.amazon.com/Bridesmaids-Kristen-Wiig/dp/B00466HN7M/ref=sr_1_1?ie=UTF8&amp;qid=1405335917&amp;sr=8-1&amp;keywords=brides+maids+movie" rel="nofollow">URLs</a> that are longer than 100 characters if you use their search field.  Thanksfully this small error was easy to address with a quick search for <a href="http://www.postgresql.org/docs/9.3/static/sql-altertable.html" rel="nofollow">PostgreSQL alter table</a>.</p>

<p>Also, I discovered the <a href="http://blog.codepen.io/radio/" rel="nofollow">Codepen Podcast</a> this weekend, and really enjoyed listening to the latest episode while playing with my son.  Good times!</p>

<p>Party On!</p>
