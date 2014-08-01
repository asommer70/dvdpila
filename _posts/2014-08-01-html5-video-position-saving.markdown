---
layout: post
title:  "HTML5 Video Position Saving"
date:   2014-08-01 11:08:12
excerpt: <p><img alt="playback code screeny" class="post-image" src="http://www.thehoick.com/images/playback_code.png"/></p>
categories: emberjs
---
<div class="post-inner">

<p><img alt="playback code screeny" class="post-image" src="http://www.thehoick.com/images/playback_code.png" /></p>

<p>One last feature I wanted to land for <a href="http://dvdpila.thehoick.com/" rel="nofollow">DVD Pila!</a> 1.0 is saving where in a video a user left off, and be able to start from where they left off once they play the video again.  Turns out implimenting this isn't all that hard.</p>

<p>To accomplish this wonderous feat of development awesomeness, I first had to add a column to the single grand table.  The <a href="http://www.postgresql.org/docs/9.3/static/sql-altertable.html" rel="nofollow">PostgreSQL documentation</a> helped to blast a numeric <em>playback_time</em> field into the table.  </p>

<p>Over on the <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video" rel="nofollow">MDN</a> is a great page detailing the video, and audio, element.  There I learned all about the JavaScript <em>play</em>, <em>pause</em>, and <em>seek</em> methods.  I figured it'd be easy to integrate them into Ember.js.  Well maybe not easy, but it should be doable.  I wasn't able to find a guide, blog post, etc on using HTML5 video with Ember, but I did find <a href="http://stackoverflow.com/questions/11416776/how-to-display-time-of-video-in-ember-js-handlebars" rel="nofollow">this</a> Stackoverflow post that is pretty close to what I was looking for.</p>

<p>After a some experimentation, I had the feature working the way I'd like.  With that DVD PIla! is ready for 1.0 in my esteemed estimation.  There are a few things that still need fixed up, and I wanted to look at comments for the blog, but I'll probably come back to that stuff down the road sometime.</p>

<p><p class="codepen"></p></p>

<p>Party On!</p>

<p>[dvdpila]</p>
</div>
