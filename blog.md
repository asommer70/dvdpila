---
layout: page
title: Blog
permalink: /blog/
---


  <ul class="posts">
    {% for post in site.posts %}
      <li>
        <a class="post-link" href="{{ post.url }}">{{ post.title }}</a>
        <span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span>
      </li>
    {% endfor %}
  </ul>
