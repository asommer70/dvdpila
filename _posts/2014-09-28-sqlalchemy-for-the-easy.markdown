---
layout: post
title:  "SQLAlchemy For The Easy"
date:   2014-09-28 22:09:28
excerpt: <p>Was offline for about 12 hours and did some more work on <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a> converting the static psycopg2 statements to SQLAlchemy objects.  Might go so far as to say that I'd wish I'd just used SQLAlchemy off the bat, but I think it was good to learn how to make PostgreSQL statments with psycopg2.  It will probably come in handy sometime.</p>
categories: emberjs
---

<p>Was offline for about 12 hours and did some more work on <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a> converting the static psycopg2 statements to SQLAlchemy objects.  Might go so far as to say that I'd wish I'd just used SQLAlchemy off the bat, but I think it was good to learn how to make PostgreSQL statments with psycopg2.  It will probably come in handy sometime.</p>

<p>The conversion to SQLAlchemy is happending because I'd like to add some additional tables to the database and I think having an ORM setup will make it a lot easier.  SQLAlchemy seems to be the most popular ORM for Python, but the <a href="https://storm.canonical.com/" rel="nofollow">Storm</a> library is also pretty cool.</p>

<p>So far I have the main <em>/dvds</em> GET and POST methods working with SQLAlchemy, and am working on getting all the <em>/dvd/$ID</em> methods setup.  Ran into a little trouble when trying to create DVDs without an Internet connection because of the Duck Duck Go integration.  Can't search for something without the Internets.</p>

<p>Hopefully I'll get this part of the next version done this week and I can move on to working on some additional features.</p>

<p>Party On!</p>

<p>[dvdpila]</p>

