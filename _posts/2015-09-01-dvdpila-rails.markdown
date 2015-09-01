---
layout: post
title:  "DVD Pila! On Rails"
date:   2015-09-01 16:10:00
excerpt: <p>It has been quite a few months since I've done any work on DVD Pila!, and there has been an increasing number of little frustrations with the way things worked.</p>
categories: rails
---

It has been quite a few months since I’ve done any work on [DVD Pila!](https://github.com/asommer70/dvdpila), and there has been an increasing number of little frustrations with the way things worked.

I think the biggest frustration was after creating 600+ DVDs in the site loading the index page always generated a pause.  I totally don't blame that on [Ember.js](http://emberjs.com/) cause I know there are multiple ways I could have made things work better.

Paging is the first thing that comes to mind.  Also, learning more about Ember and cleaning up some of the code that I uses would probably definitely help some.

So long story short, I finally got motivate enough to rebuild the web app using Ruby on Rails.

Changing from Ember to Rails is a pretty big switch.  It’s going from full blast front-end JavaScript site to backend Ruby site.  So not only did I use Rails for generating the HTML, but I also replaced the [Flask](http://flask.pocoo.org/) backend with Rails.  Which maybe using some Flask templates to generate more of the HTML would have been better too.

Either way developing, or re-developing, the site with Rails was a lot of fun and only took about eighteen hours vs about a month the first time around.

## DVD Pila Rails

Developing the Rails project was pretty straight forward since I already had all of my objects modeled in the Flask version.  I pretty much copied the same fields for the Dvd, Episode, and Bookmark objects.  I did make the Episode file URL field the same name as the Dvd unlike the Flask version where it was named *episode_file_url*.  I think that was to avoid collisions with the Dvd object.

I initially had all the tests working for the Dvd object, but got so wrapped up in coding up the other objects that I didn't go back and fix the tests or add new ones to cover new functionality.  So the project wasn't very TDD in a formal sense.  I’ll probably go back at some point and whip up at least some feature specs.

The CRUD operations for the models are pretty much standard Rails.  I used a scaffold for the Dvd object which gave me a lot of the tests, but since Episode and Bookmarks are really only accessed via a Dvd I manually created the controller, view, and model files for them.

## Foundation instead of Bourbon

Visually I really like working with [Bourbon](http://bourbon.io/) and [Refills](http://refills.bourbon.io/), even though it’s been a while since I’ve use them in a project.  Since I’ve been on such a [Foundation](http://foundation.zurb.com/docs/) kick lately I went ahead and used that for this version.

I think using Foundation helped cut down on development time because it really worked great for laying out all the elements on both the Dvd show page and index.  Plus it integrates with Rails really well.

Because of the new front-end framework there are some visual differences between the Ember.js version and this one.  Though I kept the layout mostly the same and the colors are the same.  Cause I like the way they play together.

For the tagging feature I used the [acts_as_taggable_on](https://github.com/mbleigh/acts-as-taggable-on) gem instead of coding it up manually.  This gem is pretty great, the only thing I had some trouble with was figuring out was that adding a tag wipes out all the old tags.  To work around this I just put all the tags in a comma separated list in a textarea element.  

## CoffeeScript

Besides the basic CRUD operations handle by Rails the largest development focus was spent migrating the JavaScript used to handle video playback from Ember.js to CoffeeScript.

It’s mostly jQuery functions on event handlers to determine when the video is played and paused.  The main feature, and the best feature, is saving where in a video you left off.  I really like that feature in things like Netflix and always get frustrated with other video sites that don't resume playback from where you were. Mostly those sites are online course sites that I’ve bought for what have you.

Overall the process of migrating wasn't all that bad.

## Additional Functionality

The time it took to migrate the JavaScripts was increased by the new features I added.  Mostly the new features are:

* Bookmarks for Episodes.

* Click video element to play.

* Click video element to pause.

* Sorting the index by last updated.

* Popover (tooltip) with DVD description on index page.

There is still some work to do with creating Dvds and auto-populating the fields.  The Duck Duck Go integration was never that great, and I can't remember the last time it actually worked, but I’d like to get it working again.

The ability to create Dvds from a barcode is there, but also needs some work.  I’m not sure I’m returning the correct JSON object for my [BarcodePOST](https://play.google.com/store/apps/details?id=com.thehoick.barcodepost) app.  When I tried it last time the app crashed, heh.

I’m hoping the Rails migration will make it easier to add new features going forward.  Also, hoping it’ll be a great base for a mobile and TV app…

## Conclusion

There’s no question that using Rails to rebuild the site helped things go a lot faster, but you can't give Rails all the credit for the shorter development time.  I looked back at the first commits to the project and when the first release was created on Github.  The time from initial import to release was about a month.

The thing that took most of the time back then was learning Ember.js form the ground up and trying to massage my limited JavaScript knowledge into how I wanted things to work.  Even back then I probably knew more Ruby than I did actual JavaScript, but it was a great project to learn Ember and I had a lot of fun working on it.

It was also a lot of fun rebuilding it in Rails.  In my very humble opinion of all the frameworks, libraries, etc that I’ve used Rails seems to be the best at getting you to a working “something” in the shortest amount of time.

There are a few minor features and bug fixes I’d like to work on so I’ll probably work on it for thirty minutes to an hour here and there over the next few weeks, but for the most part DVD Pila! Is back up and going strong for the foreseeable future.  Also, going to work on updating the documentation in the wiki and maybe add some more blog posts.

Been an awesome ride so far, and who knows down the road I’ll probably use DVD Pila! As a test bed for learning whatever web technology is grabbing my attention at the moment.

Party On!
