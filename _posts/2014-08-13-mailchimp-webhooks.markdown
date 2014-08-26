---
layout: post
title:  "MailChimp Webhooks"
date:   2014-08-13 09:08:24
excerpt: <p><img alt="mailchimp wbsite screeny" class="post-image" src="http://www.thehoick.com/images/mailchimp_webhooks.png"/></p>
categories: emberjs
---
 

<p><img alt="mailchimp wbsite screeny" class="post-image" src="http://www.thehoick.com/images/mailchimp_webhooks.png" /></p>

<p>My idea to enable a free download after joining the <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a> mailing list is to use the MailChimp <a href="http://apidocs.mailchimp.com/webhooks/" rel="nofollow">Webhook</a> feature.  I've started a simple PHP script, well hopefully it'll end up being simple, to generate a unique string and save the information into a simple database table.</p>

<p>I've gotten everything setup, but for whatever reason whenever I join the mailing list the POST request coming from MailChimp isn't saving the data.  I think I'm just not using the data structure they send correctly, but who knows.  Also, it's kind of a pain to have to go through the process of joining a mailing list just to test the script at my end.   Over and over and again.</p>

<p>Makes me wish they had some type of sandbox.  Or a button that says send "fake webhook now".</p>

<p>I'm actually going to use two MySQL tables for this project.  One of the data coming from MailChimp, and one for data related to the actual download.  I'm also realizing that I'm not entirely sure how to allow a unique URL for downloads in PHP.  Huh, will have to look that one up.</p>

<p>Crazy how something seeminly very simple can escalate in complexity really quickly...</p>

<p>Party On!</p>

<p>[dvdpila]</p>
 
