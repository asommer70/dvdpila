---
layout: post
title:  "Ember Data Break Through"
date:   2014-07-09 16:07:46
excerpt: "After poking through the source code for Ember Data and Ember to try and determine why there wasn't any data being sent in the HTTP POST, I've finally had a break through."
categories: emberjs
---
 

<h3>Lot's of Ember Learning</h3>

<p>After poking through the source code for Ember Data and Ember to try and determine why there wasn't any data being sent in the HTTP POST, I've finally had a break through.  </p>

<p>The break through came not from digging through the source, which was a lot of fun, but from finally finding relavant Google search.  I turned up this <a href="http://stackoverflow.com/questions/21974570/ember-js-typeerror-type-create-is-not-a-function" rel="nofollow">question</a> on StackOverflow.  To find the post I searched Goolge with "ember data type._create". So I guess working with the source did help because that's where I found the call to <em>type._create</em>.</p>

<p>The answer to the question is to install the latest Beta version of Ember Data.  I was using version .14 originally after following the suggested <em>bower install ember-data --save</em>.  After cloning the <a href="https://github.com/emberjs/data" rel="nofollow">repo</a> and following the <a href="https://github.com/emberjs/data#setup" rel="nofollow">setup</a> instructions I was able to build the packages and copy a new ember-data.js file into my project.</p>

<p>There were a few new errors in the Chrome Dev Tools console, but a few adjustments to my app.js file were all that was needed to update to the new Ember Data syntax.  So back to my code that uses the createRecord method and still not seeing anything in the output from my Flask server where I called <em>print request.form</em> to view the POST data.  Since there weren't any additional errors in the JavaScript console, I got to thinking that maybe there was some data and I'm just not seeing it.  The <em>print request.form</em> call has worked with a non-Ember Data version, so I thought it would work here as well.  </p>

<p>Silly me.  I then googled "flask post content" and turned up this StackOver flow <a href="http://stackoverflow.com/questions/10434599/how-can-i-get-the-whole-request-post-body-in-python-with-flask" rel="nofollow">post</a>.  And you guessed it after calling <em>print request.data</em> I was able to see a "dvd" JSON string sent to the server via HTTP POST.</p>

<p>A quick look at the database and voila new records in the table.  Actually there were a lot of new records in the table.  Most of them had empty strings because I wasn't passing the correct data into the SQL query.</p>

<h3>Lessons Learned:</h3>

<ol>
<li>Build from the latest source if a project is in heavy development. (this did occur to several days ago, but I didn't listent to myself)</li>
<li> Double check the database.</li>
<li>Print the entire request object on the server side.</li>
</ol>

<h3>Top 2 Tech Ideas:</h3>

<ol>
<li>Add <a href="https://github.com/tholman/giflinks" rel="nofollow">Giflinks</a> to a web app for added fun.</li>
<li>Might use <a href="http://codyhouse.co/gem/smart-fixed-navigation/" rel="nofollow">Smart Fixed Navigation</a> for a web app project.  Might be good for Photolandia instead of Headroom.js.</li>
</ol>

<p>Party On!</p>
 
