---
layout: post
title:  "More Progress With Ember Data"
date:   2014-07-10 21:07:59
categories: emberjs
---

<p>Today I was able to clean up my controller and router functions.  I had a crap ton of <em>console.log()</em> calls to try and figure out what <em>this</em> is in any particular situation, and if I can call things like <em>get('model') and get('store')</em> on it.  </p>

<p>Also cleaned up the Flask server.  Had a gaggle of routes that took URL arguments as parameters to query against the database.  The whole REST HTTP method things is pretty awesome.  Cut down like 8 routes to just 2.  Though inside those routes you then have to add some if statements to handle the different HTTP methods.  Well that's what I did at least, there are probably other ways to take care of business.</p>

<p>I need to post some code at some point.  </p>

<p>Party On!</p>
