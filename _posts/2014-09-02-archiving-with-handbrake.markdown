---
title:  "Archiving DVDs with Handbrake"
layout: post
date:   2014-09-02 07:11:00
excerpt: <p><img alt="ember rest" class="image" src="http://www.thehoick.com/images/handbrake/handbrake_open.png"/> </p>
categories: emberjs
---


<p><img alt="ember rest" class="image" src="http://www.thehoick.com/images/handbrake/handbrake_open.png"/> </p>

I've known about this the [Handbrake](https://handbrake.fr/) tool for a while. I even used it once on Windows to archive a scratched DVD that wouldn't read on other workstations.

I was pleasently surprised that Handbrake is available for Linux and in the Ubuntu 14.04 apt repository.  I thought it would be worth a try to see how it compares to [OGMRip](http://dvdpila.thehoick.com/emberjs/2014/08/26/archiving-with-ogmrip/).  After using Handbrake for about two weeks I am now a die hard fan, and don't know if I'll ever go back to OGMRip.

It's just that much better.

## Installing

To install Handbrake on Ubuntu 14.04 LTS open a termainal and enter:

```
sudo apt-get install handbrake
```

The command line utility **HandBrakeCLI** is also very good at archiving DVDs, and using it on a remote workstation via SSH is a major time saver.  So you might also install it with:

```
sudo apt-get install handbrake-cli
```

## Using Handbrake

Open Handbrake by clicking the Ubuntu icon in the top left hand corner of your desktop and type *handbrake* into the search field.

![](http://www.thehoick.com/images/handbrake/handbrake_search.png)

Click the "Source" button to select a DVD to archive.

![](http://www.thehoick.com/images/handbrake/handbrake_open.png)

After selecting a DVD Handbrake will scan the disc for titles to archive.  You can choose a specific one in the "Title" drop down.  This is very handy for T.V. show DVDs that have more than one episode on them.

![](http://www.thehoick.com/images/handbrake/handbrake_title.png)

At this point click the "Start" button to begin archiving the DVD.  You should notice progress messages at the bottom of the window.

![](http://www.thehoick.com/images/handbrake/handbrake_progress.png)

Also, before archiving a DVD you can choose a profile from tlist in the little "sub-window" to the right of the main window.

![](http://www.thehoick.com/images/handbrake/handbrake_profiles.png)

Another useful feature of Handbrake is the *Activity Window* that will show you useful information about the archiving process.  Click the "Activity Window" button in the upper right hand menu to open it.

![](http://www.thehoick.com/images/handbrake/handbrake_activity.png)

After a short time Handbrake will alert you to the archive completion with a funny little pop-up.  


### Using HandBrakeCLI

The main command I use to archive DVDs with *HandBrakeCLI* is:

```
sudo HandBrakeCLI -i /dev/sr0 -E ffaac -o DVD_NAME.mkv
```

The above command uses the *default* profile, and I also frequently use the *"High Profile"*:

```
sudo HandBrakeCLI -i /dev/sr0 -E ffaac -o DVD_NAME.mkv --preset="High Profile\
```

Use the **-z** option to view the profiles you have available:

```
HandBrakeCLI -z
```

## Conclusion

I have noticed that Handbrake finishes an archvie orders of magnitude faster than other utilities I have used like OGMRip.  Not 100% sure why Handbrake is so much faster, but I'm very glad I finally decided to give it another try.


Party On!
