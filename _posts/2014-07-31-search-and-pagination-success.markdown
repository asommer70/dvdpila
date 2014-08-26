---
layout: post
title:  "Search and Pagination Success!"
date:   2014-07-31 09:07:56
excerpt: <p><img alt="search and pagination ftw!" class="post-image" src="http://www.thehoick.com/images/search_or_pagination_win.jpg"/></p>
categories: emberjs
---
 

<p><img alt="search and pagination ftw!" class="post-image" src="http://www.thehoick.com/images/search_or_pagination_win.jpg" /></p>

<p>Turns out the easiest way to fix my Ember.js pagination and search problem is to move the search functionality into it's own controller, move the search field out of the DVD list div, and apply some if statements in the template to display either search results or the paginated <em>all DVDs</em> list.  Took a lot of learning to figure that out.</p>

<p>Might add some pagination to the search results at some point, but for now I'm just glad it's working the way it is.  I'm sure there's better ways to do search than a PostgreSQL regex as well.  Though I was doing a JavaScript regex before.</p>

<p><a href="http://alg.github.io/talks/emberjs" rel="nofollow">This cool</a> Ember demo wasn't 100% responsible for the solution, but I borrowed a lot of code from <a href="https://github.com/alg" rel="nofollow">Aleksey</a>.  I also learned about the <em>insertNewline</em> method which I know will come in handy in either this project or future ones.  Learning more about Ember ArrayControllers and attribute bindings was helpful too.</p>

<p>I feel like I can see the 1.0 release of DVD Pila! and it feels good...</p>

<p>Party On!</p>

<p>[dvdpila]</p>
 
