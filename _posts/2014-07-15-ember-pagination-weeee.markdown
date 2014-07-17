---
layout: post
title:  "Ember Pagination Weeee"
date:   2014-07-15 11:07:58
categories: emberjs
---

<p><img alt="console screenshot" src="http://www.thehoick.com/images/pagination.png" /></p>

<p>The next big hurdle for my little project is to add some pagination to the 110 item object collection.  I might look into server side pagination at some point, after finding out that that is even a thing, but for now adding a few funcitons to the Ember controller has given the needed functionality.</p>

<p>I used <a href="http://hawkins.io/" rel="nofollow">Adam Hawkin's</a> great <a href="http://hawkins.io/2013/07/pagination-with-ember/" rel="nofollow">pagination</a> guide, and it worked for me with only a few changes.  The changes were quite minor adjusting <em>bindAttr</em> to <em>bind-attr</em> was the main one.  Ember printed some deprecation messages in the console, but everything still worked.  I also needed to move one of the functions into the actions object, but other than that everything worked as the coded in the <a href="http://jsbin.com/ijoqom/6/edit" rel="nofollow">JS Bin</a> example.</p>

<p>There was an issue with my "search" filter after adding pagination.  I first thought that if you clicked on a different page that the filter broke, but after more testing I realized that it's filtering only the objects on the current page forward.  So after some digging and wrong turns, I added this quick call in my query action: <em>this.send('selectPage', 1);</em>.  This will executes the <em>selectPage</em> action function sending it back to the first page, and after that all the results are filtered on the search query.  Bob's your uncle!</p>

<p>Next up... star rating.</p>

<p>Party On!</p>
