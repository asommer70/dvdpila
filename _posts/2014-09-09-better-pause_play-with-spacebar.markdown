---
layout: post
title:  "Better Pause/Play with Spacebar"
date:   2014-09-09 17:09:05
excerpt: <p><img alt="dvdpila play" class="post-image" src="http://www.thehoick.com/images/dvdpila_search_play.png"/></p>
categories: emberjs
---

<p><img alt="dvdpila play" class="post-image" src="http://www.thehoick.com/images/dvdpila_search_play.png" /></p>

<p>I mentioned in a previous post about my current "most annoying but" in <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a> is that the spacebar pause/play functionality kills the search when inside a DVD page.  I worked on it for about half an hour in between learning some Android stuff, and I think I have a solution.  </p>

<p>Instead of putting the pause/play key binding inside the <em>this.$().on</em> calls, I moved it into a function tied to the Ember View <strong>keyUp</strong> event.  The code now looks like this:</p>

<pre><code>keyUp: function(event) {
  var $vid = $(event.target)[0];

  if (event.keyCode == 32 &amp;&amp; $vid.paused == true) {
    $vid.play(); 
  } else if (event.keyCode == 32 &amp;&amp; $vid.paused == false) {
    $vid.pause();
  }
},
</code></pre>

<p>The code worked as expected in my test environment so I went ahead and committed the code.  When I synced to the production install I noticed that there was still an issue.  </p>

<p>When you browse to a DVD page and watch a video the space pause/play does indeed work as expected, so that's good, and when doing a search the page does change the results.  The problem comes up when you enter a second DVD page, hit play, then try to search for something else.  The search doesn't work for some reason.  </p>

<p>Thinking I might need to replace the groovy <em>enter/return</em> keybinding on the search field to an actual button.  Doesn't seem as fun, but I'd like both features to work they way they are meant to.</p>

<p>Party On!</p>

<p>[dvdpila]</p>

