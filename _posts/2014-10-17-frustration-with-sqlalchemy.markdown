---
layout: post
title:  "Frustration with SQLAlchemy"
date:   2014-10-17 17:10:56
excerpt: <p>Started work on adding a second table to <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a>, and so far so good.  Adding the table to contain information about an episode/disc is easy enough, but I ran into a little confusion once I started modeling the second table in SQLAlchemy.</p>
categories: emberjs
---

<p>Started work on adding a second table to <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a>, and so far so good.  Adding the table to contain information about an episode/disc is easy enough, but I ran into a little confusion once I started modeling the second table in SQLAlchemy.</p>

<p>Defining the table is a snap and setting up the relationship via foriegn key from the <strong>dvd_id</strong> column in the <em>episodes</em> table to the <strong>id</strong> column of the <em>dvds</em> table is equally trivial.  The small hiccup I first encountered is figuring out where the episodes will be listed in a query object.</p>

<p>I figured things would be more like ActiveRecord and there'd be a <strong>episodes</strong> attribute on the object which would contain a list of Episode instances.  That doesn't seem to be the case with SQLAlchemy. Instead they episodes are listed under a <strong>children</strong> attribute.  Not a big deal, but I think the ActiveRecord way of doing things is a little more intuitive.</p>

<p>I've also come to wish more and more that there was a good way to convert an SQLAlchemy object to JSON.  If I was using a server side template the SQLAlchemy object would do just fine I'm sure.  Makes me want to look into some other Python ORMs.</p>

<p>We'll see how things go...</p>

<p>Party On!</p>

<p>[dvdpila!]</p>

