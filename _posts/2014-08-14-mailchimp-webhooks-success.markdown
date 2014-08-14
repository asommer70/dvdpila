---
layout: post
title:  "MailChimp Webhooks Success"
date:   2014-08-14 15:08:19
excerpt: <p><img alt="mailchimp sql table screeny" class="post-image" src="http://www.thehoick.com/images/mailchimp_sql_table.png"/></p>
categories: emberjs
---
<div class="post-inner">

<p><img alt="mailchimp sql table screeny" class="post-image" src="http://www.thehoick.com/images/mailchimp_sql_table.png" /></p>

<p>The MailChimp Webhooks working today for both subscribing and unsubscubing.  I had another one of those face palm errors.  I couldn't figure out why the POST from MailChimp wasn't exucting the code in my <em>index.php</em>.  Things like this are where <strong>curl</strong> is your friend.</p>

<p>Using <em>curl http://localhost/ml</em> I was able to see the output HTML.  It was not what I was expecting.  Instead of a boring message with information from the MySQL database connection there was a <em>303</em> redirect from the server.  After around an hour of hunting through Apache configurations and trying a few things out (also some random internet distractions), I finally executed <em>curl http://localhost/ml/</em> and received the response I expected.  </p>

<p>It was all about the trailing <strong>"/"</strong>, who knew?  One of those things that I feel I should have known.</p>

<p>With that little error squared away, and the Webhook URL updated in MailChimp things started looking up.  Of course there were some additional PHP and MySQL errors.  The major one was some problems in my SQL query, but not being able to see what the error actually was.  I finally found this little gem that will log the errors if there are any:</p>

<pre><code>$stmt = $mysqli-&gt;prepare($query) or die("Prepare failed: (" . $mysqli-&gt;errno . ") " . $mysqli-&gt;error);
</code></pre>

<p>This will write the error to the log file, <em>/var/log/apache2/error.log</em> in my case, which is massively helpful.  This uses the <em>mysqli</em> interface there is slightly different syntax for PHP's MySQL PDO interface.</p>

<p>Now I just need to build a page to download the eBook and update the <em>downloads</em> table.</p>

<p>Party On!</p>

<p>[dvdpila]</p>
</div>
