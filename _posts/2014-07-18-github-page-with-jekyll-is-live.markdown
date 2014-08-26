---
layout: post
title:  "Github Page With Jekyll is Live!"
date:   2014-07-18 10:07:12
excerpt: <p><img alt="sass website screeny" src="http://www.thehoick.com/images/sass.png" /></p>
categories: emberjs
---
 

<p><img alt="sass website screeny" src="http://www.thehoick.com/images/sass.png" /></p>

<p>The documentation for Github pages is pretty good, but I ran into a couple of problems while setting up my project page.  The first problem was with configuring my DNS server to use a CNAME that points back to the Github project page.  <a href="https://help.github.com/articles/tips-for-configuring-a-cname-record-with-your-dns-provider" rel="nofollow">This page</a> has good information on adding the DNS records you'll need, but in this case I needed them to really spell it out for me and give me a sample BIND configuration.</p>

<p>Or maybe I'm just dense and it was after 10:00pm.  My mind turns to crackers and jelly after 9:30.  The table at the bottom of <a href="https://help.github.com/articles/about-custom-domains-for-github-pages-sites#subdomains" rel="nofollow">this page</a> clued me into the problem.  I didn't think that having a CNAME record with a "/" in it would workd, but when I ran <em>named-checkzone</em> on the config file it didn't give me any errors either.  After carefully reading the page and the table information I realized that GIthub will setup the root of the site as <em>/projectname</em> and the domain name is determined by the <a href="https://help.github.com/articles/adding-a-cname-file-to-your-repository" rel="nofollow">CNAME</a> file you configure in the respository.</p>

<p>I should just work on new things in the morning, cause once I had everything configured correctly it worked like a charm.  Well almost...</p>

<p>The second problem had to do with Jekyll and SASS.  For security reasons Github disables all Jekyll plugins which means that when they <em>jekyll build</em> your site some of the content may be off if you are relying on plugins.  I didn't realize that I was relying on a plugin when I was locally using SASS as detailed in the <a href="http://jekyllrb.com/docs/assets/" rel="nofollow">Jekyll documentation</a>.  So I had a site on Github using a custom domain, but no stylesheets, doh.</p>

<p>I haven't solved the SASS, Jekyll, and Github issue in a cool and clever way, but I did compile the stylesheet using <em>jekyll serve -w</em> and manually copy the <em>_site/css/style.css</em> file into the <em>css</em> directory which then gets copied back when Github builds the site.  Some extra hubabaloo, but things are now working and looking good.</p>

<p>Check out my new project site <a href="http://dvdpila.thehoick.com" rel="nofollow">here</a>.  I'll be releasing the actual code soon.  Just need to add a few last features.</p>

<p>Party On!</p>
 
