---
layout: page
title: Blog
permalink: /blog/
---


  <ul class="posts">
    {% for post in site.posts %}
      <li>
        <div class="post-wrapper">
        <div class="post-part">
          <a class="post-link" href="{{ post.url }}">{{ post.title }}</a>
          <span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span>
        </div>
        <div class="post-part">
          {{ post.excerpt | remove: '<img>' }}
        </div>
        </div>
      </li>
    {% endfor %}
  </ul>
