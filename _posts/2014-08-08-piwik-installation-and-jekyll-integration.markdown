---
layout: post
title:  "Piwik Installation and Jekyll Integration"
date:   2014-08-08 14:08:47
excerpt: <p><img alt="piwik website screeny" class="post-image" src="http://www.thehoick.com/images/piwik.png"/></p>
categories: emberjs
---
 

<p><img alt="piwik website screeny" class="post-image" src="http://www.thehoick.com/images/piwik.png" /></p>

<p>I've started feeling a little paranoid about how much I uses Google's services.  I know, and have always known, that they offer their services for free in order to gather information on me to better sell advertising meant specifically targeted for my eye balls.  With all the uproar over the NSA and what not I've been thinking of ways to ween myself off some of their stuff.  The problem I keep having is that's most of their services are just so great.</p>

<p>I tried out <a href="https://duckduckgo.com/" rel="nofollow">Duck Duck Go</a> for web searches for a week or two, but ended up going back to Google.  I think the results are more relevant, but maybe that's because I've been using Google for so long and they can guess what I'm looking for better.  I also setup <a href="https://www.mailpile.is/" rel="nofollow">Mailpile</a> for a domain I own.  Thought it might replace Gmail (at least until things got too spammy), but the project was way too buggy when I tried it.  Might be worth another look at this point though.</p>

<p>I recently realized that a crap ton of sites use Google Analytics for monitoring their site's stats, and it's almost the only option talked about in podcasts. blogs, etc.  That got me thinking that even if I stopped using all Google services they could still get a lot of information just from their analytics services.  So I went on a search for an alternative... preferably self hosted.</p>

<p>Enter <a href="https://www.mailpile.is/" rel="nofollow">Piwik</a>.  Probably doesn't have all the bells and cheese that Google Analytics does, but the fact that it is self-hosted and can count the number of visitors that go to the site.  I'm sure there's a place for tracking what color button works better, where to put images, etc, but  at this point all I really want is to know if my traffic is going up, down, or sideways.</p>

<p>The installation of Piwik is very simple:</p>

<ol>
<li>Download the zip file.</li>
<li>Extract the zip file and move the piwik directory into a folder served by a web server that can handle PHP.</li>
<li>Setup the MySQL database. <em>mysql -u root -p -e "create table piwik;"; mysql -u root -p -e "grant all on piwik.</em> to piwik@localhost identified by 'balls!';"*</li>
<li>Browse the the piwik folder on the server where you extracted the zip file.</li>
<li>Go through the setup wizard steps.</li>
<li>Copy and paste the JavaScript for your new Piwik installation into your HTML site.</li>
</ol>

<p>In my case I setup Piwik to gather some stats on the <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a> website hosted on Github pages.  It integrated great with <a href="http://jekyllrb.com/" rel="nofollow">Jekyll</a> by placing the JavaScript in the <em>_includes/head.html</em> file right after the <em>head</em> tags.</p>

<p>Yay for stats... maybe in a future post I'll include some graph screenies.</p>

<p>Party On!</p>

<p>[dvdpila]</p>
 
