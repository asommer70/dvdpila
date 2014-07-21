---
layout: post
title:  "Migrating Code and ConfigParser"
date:   2014-07-21 17:07:13
excerpt: <p><img alt="Discourse and PHP Woo" src="http://www.thehoick.com/images/configparser.png" /></p>
categories: emberjs
---
<div class="post-inner">

<p><img alt="Discourse and PHP Woo" src="http://www.thehoick.com/images/configparser.png" /></p>

<p>I've gotten around to migrating the actual code for the <a href="https://github.com/asommer70/dvdpila" rel="nofollow">DVD Pila!</a> web app.  It's now officiall more than just a Github pages <a href="http://dvdpila.thehoick.com/" rel="nofollow">webasite</a>.  </p>

<p>I think from a design aspect it's my best work yet.  I've really enjoyed sing the <a href="http://refills.bourbon.io/" rel="nofollow">Refills</a> mixin library as well as the other <a href="http://bourbon.io/" rel="nofollow">Bourbon</a> libraries.  Bourbon has become my goto design framework.  I still like Bootstrap and Foundation, but there's just something really cool about using straight Sass.</p>

<p>The other thing I accomplished today was to migrate the database connection code from using straight username, host, and password to storing those variables in a config file.  I never realized that Python came with great functions baked in like the <a href="https://docs.python.org/2/library/configparser.html" rel="nofollow">ConfigParser</a> module.</p>

<p>In three quick lines your config files is read and your options are at your fingertips:</p>

<pre><code class="python">import ConfigParser

config = ConfigParser.ConfigParser()
config.readfp(open('config.cfg'))
</code></pre>

<p>Use <em>get</em> along with the section to retrieve specefic values:</p>

<pre><code class="python">db_name = config.get('Database', 'db')
</code></pre>

<p>Of course to write to a config file there is a <em>set</em> method.  I think this will be a very useful thing to know.</p>

<p>Party On!</p>

<p>[dvdpila]</p>
</div>
