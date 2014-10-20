---
layout: post
title:  "Ember Data Child ID"
date:   2014-10-19 18:10:30
excerpt: <p>You can use a different attribute other than <strong>id</strong> to determine child objects with Ember Data if you configure it.  In my case for <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a> I needed to set things up like this:</p>
categories: emberjs
---

<p>You can use a different attribute other than <strong>id</strong> to determine child objects with Ember Data if you configure it.  In my case for <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a> I needed to set things up like this:</p>

<pre><code>App.ApplicationSerializer = DS.RESTSerializer.extend({
  keyForRelationship: function(key, relationship) {
    return 'dvd_id';
  }
});
</code></pre>

<p>Once the <strong>ApplicationSerializer</strong> was configured things finally started working fine inside the Handlebars template.  </p>

<p>Might have to come up with a better way of hiding forms than with a Controller attribute.  Maybe...</p>

<p>Party On!</p>

<p>[dvdpila]</p>

