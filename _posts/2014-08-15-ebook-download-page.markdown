---
layout: post
title:  "eBook Download Page"
date:   2014-08-15 14:08:46
excerpt: <p><img alt="ebook download" class="post-image" src="http://www.thehoick.com/images/dvdpila_ebook.png"/></p>
categories: emberjs
---
<div class="post-inner">

<p><img alt="ebook download" class="post-image" src="http://www.thehoick.com/images/dvdpila_ebook.png" /></p>

<p>Worked on the <em>5-tools</em> PDF download page for the <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a> mailing list.  The process so far has been pretty simple, I just copied up the index.html from the actual DVD Pila! web app as well as the assets, CSS, etc and made things straight HTML instead of <a href="http://handlebarsjs.com/" rel="nofollow">Handlebars</a>.</p>

<p>In my last job I helped setup a file sharing site to allow clients to download certain files, but not others, from a web server.  There was some "sort of clever" PHP involved to check that the client has access to a file, then use the <em>heade()</em> function to redirect them to the download.  Doing so means that unless they are watching the download process in something like Chrome Dev Tools they won't see the download link.</p>

<p>I've run into a little snag with doing the same type of thing for the eBook download.  I'm using a button to download the file instead of a link and using some JavaScript to send an AJAX request to the same PHP file that downloads the file.  The problem is that since the file is a PDF Chrome will automatically open the file in the browser.  I'd like to save the file, then replace the button with a thank you message.  Now that I think about it there's probably a way to override that behavior in Chrome.</p>

<p>Will need to look into that...</p>

<p>Party On!</p>

<p>[dvdpila]</p>
</div>
