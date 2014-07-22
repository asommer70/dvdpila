---
layout: post
title:  "Problems with Pagination and Ember"
date:   2014-07-22 14:07:40
excerpt: <p><img alt="pages" class="post-image" src="http://www.thehoick.com/images/pages.png" /></p>
categories: emberjs
---
<div class="post-inner">

<p><img alt="pages" class="post-image" src="http://www.thehoick.com/images/pages.png" /></p>

<p>I've blasted into a problem with adding DVD records to the ArrayController in Ember.js.  The pagination guide I followed didn't take into account adding new records to the paginated collection.  As far as I can tell it doesn't anyway.</p>

<p>The problem with using code someone else has written is that sometimes you don't understand how it works.  I'm okay with not understanding how a particular peice of code works in my project... as long as it doesn't cause problems.  Understanding every line of code you use, without a doubt, is a better way to code and makes you a better developer all around.  Sometimes you just have to get things done and hack it together however works.  I'm thinking this isn't one of those situations.</p>

<p>On Saturday night I decided to experiment with my own little "development sprint" to see how much I could get accomplished with the <a href="https://github.com/asommer70/dvdpila" rel="nofollow">DVD PIla!</a> web app.  I was able to migrate the code from my self-hosted <a href="https://about.gitlab.com/" rel="nofollow">Gitlab</a> repo to Github, implement a HMLT5 video element in Ember, adjust the database schema for a field to container a URL for the video file, and a plethora of improvements to the Flask server.</p>

<p>I started the sprint at 10:00pm on Saturday, and had the video element implemented by around 11:00 ish.  At which point I realized that I need to convert all my AVI files to MP4 so they can work in the video element, doh.  It's very cool to be able to view your videos in your a browser from any devise in your house, and I soon got caught up watching <a href="https://duckduckgo.com/?q=terminator+salvation" rel="nofollow">Terminator: Salvation</a> which I haven't seen in a while.  So I got back to serious work on the project around 1:00am.</p>

<p>At 3:00am I had most of the server code fixed up, and all the small things working and looking good.  I went to bed at 3:00am meaning to get back up at 5:00am and continue working, but the snooze was just too good.  I ended up getting back into it at 5:30am after my son woke up.  There's not a better alarm clock in the world than a 16 month old child.  </p>

<p>So I've been on this pagination problem for about 4 hours now... hopefully I can have it locked up soon.  I think after that it'll be time to release a version 1.0.</p>

<p>Party On!</p>

<p>[dvdpila]</p>
</div>
