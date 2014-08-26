---
layout: post
title:  "MailChimp Templates Figured Out"
date:   2014-08-18 17:08:22
excerpt: <p><img alt="mailchimp edit" class="image" src="http://www.thehoick.com/images/mailchimp_edit.png"/> </p>
categories: emberjs
---
 

<p><img alt="mailchimp edit" class="image" src="http://www.thehoick.com/images/mailchimp_edit.png" /> </p>

<p>So reading the documentation is a good thing... who knew?  </p>

<p>I went back and worked on the custom <a href="http://kb.mailchimp.com/article/template-language-creating-editable-content-areas/" rel="nofollow">MailChimp</a> template and tried to figure out why I couldn't add text to the main body of the email.  Turns out you need to add some custom attributes to the element.  From what I understand you can use <em>div</em> elments as well as table cell <em>td</em> elements.  So adding:</p>

<pre><code>mc:edit="content"
</code></pre>

<p>To a <em>td</em> element allows you to edit the "field" when creating your campaign.  The <a href="http://kb.mailchimp.com/article/getting-started-with-mailchimps-template-language" rel="nofollow">MailChimp Template Language</a> documentation was very helpful in figuring out why MailChimp kept wanting to attach their own footer to my template.  Turns out I didn't implement all the required <strong>Merge Tags</strong> needed for the free version.  I initially grabbed the fields from the example template, but for whatever reason didn't keep all the ones I needed.  Probably because I thought they weren't needed.</p>

<p>Another problem I blasted into with the footer was when I included the <em>|HTML:LIST_ADDRESS_HTML|</em> tag the text came out in really odd colors.  It wasn't respecting the color style added to the parent <em>td</em> element.  To work around that I wrapped the offending merge tags with <em>span</em> elements:</p>

<pre><code>&lt;span style="color: #858585;"&gt;*|LIST_ADDRESS|*&lt;/span&gt;
</code></pre>

<p>Also, I used the <em>LIST_ADDRESS</em> tag instead of the <em>LIST_ADDRESS_HTML</em> tag because the text is a lot simpler and looked better in my footer.</p>

<p>There's a lot of other cool features that the MailChimp template language can do, and I'd be fun to go back and explore them.  I think I want a pretty simple and clean template for most communications though.  Trying to give the feel that the email is from an actual human and not a canned response from some corporation trying to sell you shit.</p>

<p>Party On!</p>

<p>[dvdpila]</p>
 
