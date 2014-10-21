---
layout: post
title:  "Ember Data and Has Many"
date:   2014-10-21 16:10:44
excerpt: <p>So I'm not quite sure how to solve my current problem with <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a> 2.0.  I've setup the "child"/"has many" and "belongs to" relationship in Ember Data, but the problem now is that on the main page I'm getting a list of DVD objects and when I click a link for a DVD it doesn't actually call the <em>"/dvd/:dvd_id"</em> like maybe it should.</p>
categories: emberjs
---

<p>So I'm not quite sure how to solve my current problem with <a href="http://dvdpila.thehoick.com" rel="nofollow">DVD Pila!</a> 2.0.  I've setup the "child"/"has many" and "belongs to" relationship in Ember Data, but the problem now is that on the main page I'm getting a list of DVD objects and when I click a link for a DVD it doesn't actually call the <em>"/dvd/:dvd_id"</em> like maybe it should.</p>

<p>The result is that when you click a DVD with Episodes they don't show up.  If you then refresh the page and call the <em>"/dvd/:dvd_id"</em> URL and Ember Data fetches the DVD object and it's children Episode objects, the Episodes show up fine.  I've tried several JSON outputs to combine the Episodes with the DVD objects in the main page, but if the first object doesn't have an <strong>id</strong> attribute Ember doesn't like it.</p>

<p>The basic DVD with Episode JSON is:</p>

<pre><code class="json">{
dvd: {
rating: 5,
title: "Game Of Thrones Season 1",
created_at: "2014-10-19 10:18:18",
file_url: null,
created_by: "Adam",
episodes: [
39,
48,
],
image_url: "images/77b60a9d.jpg",
abstract_source: "Me",
abstract_txt: "Testing and things...",
abstract_url: "",
playback_time: 254,
id: 41
},
episodes: [
{
dvd_id: 41,
id: 39,
episode_file_url: "",
name: "Disc 1"
},
{
dvd_id: 41,
id: 48,
episode_file_url: "",
name: "Disc 3"
},
}
</code></pre>

<p>While the list of DVDs on the main page is:</p>

<pre><code class="json">dvds: [
{
dvd: {
rating: 5,
title: "Superbad Movie",
created_at: "2014-07-31 07:03:33",
file_url: "http://localhost/Videos/SUPERBAD_UNRATED.mp4",
created_by: "Adam",
episodes: [ ],
image_url: "images/b70240f1.png",
abstract_source: "Wikipedia",
abstract_txt: "Superbad is a 2007 American comedy film directed by Greg Mottola and starring Jonah Hill and Michael Cera. The film was written by Seth Rogen and Evan Goldberg, who began working on the script when they were both thirteen years old. They completed a draft by the time they were fifteen. The film's main characters have the same given names as Rogen and Goldberg. It was also one of a string of hit films produced by Judd Apatow.",
abstract_url: "https://en.wikipedia.org/wiki/Superbad_(film)",
playback_time: 1853,
id: 4
},
episodes: [ ]
},
{
dvd: {
rating: 5,
title: "Elephants Dream",
created_at: "2014-07-20 02:35:33",
file_url: "https://archive.org/download/ElephantsDream/ed_1024.ogv",
created_by: "Adam",
episodes: [ ],
image_url: "images/9252c944.jpg",
abstract_source: "Wikipedia",
abstract_txt: "Elephants Dream is a short computer-generated short film that was produced almost completely using the free software 3D suite Blender. It premiered on 24 March 2006, after about 8 months of work. Beginning in September 2005, it was developed under the name Orange by a team of seven artists and animators from around the world. It was later renamed Machina and then to Elephants Dream after the way in which Dutch children's stories abruptly end.",
abstract_url: "https://en.wikipedia.org/wiki/Elephants_Dream",
playback_time: 6,
id: 3
},
episodes: [ ]
},
}]
</code></pre>

<p>Not sure how to associate an <strong>episodes</strong> object with a particular DVD object in this format.  Guess I'll have to dig in the documentation some more.</p>

<p>Party On!</p>

<p>[dvdpila]</p>

