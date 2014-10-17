---
layout: post
title:  "Empty Branch With Git"
date:   2014-10-10 16:10:52
excerpt: <p>So I wanted to setup a Github style scenario for my latest Android app's website.  I love using Jekyll with Github Pages, and wanted to build a site using Jekyll to host myself.  I first thought about creating a new repository for the website, but then I was all like "wait, how does Github do it?".  </p>
categories: emberjs
---

<p>So I wanted to setup a Github style scenario for my latest Android app's website.  I love using Jekyll with Github Pages, and wanted to build a site using Jekyll to host myself.  I first thought about creating a new repository for the website, but then I was all like "wait, how does Github do it?".  </p>

<p>A quick googling sent me to [this]http://bitflop.com/tutorials/how-to-create-a-new-and-empty-branch-in-git.html) great guide.  So basically all you need to do is checkout the repository:</p>

<pre><code>git clone http://path/to/your/repo
</code></pre>

<p>Checkout an <strong>orphan</strong> branch:</p>

<pre><code>git checkout --orphan website
</code></pre>

<p>Remove all the files:</p>

<pre><code>git rm -rf .
</code></pre>

<p><strong>Note:</strong> I felt a little boilky about deleting all the flies, but then I remembered that I'm using Android Studio and the files are also checked out into a whole other directory.</p>

<p>Finally, copy/create new files in the branch and commit them:</p>

<pre><code>git add .
git commit -am "Inital Import"
</code></pre>

<p>You can switch back to the master branch with:</p>

<pre><code>git checkout master
</code></pre>

<p>And see that all the original files are back like a champ, then just:</p>

<pre><code>git checkout webite
</code></pre>

<p>And boom back to developing a killer Jekyll site.  Fun Times!!</p>

<p>Party On!</p>

