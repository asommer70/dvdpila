---
title:  "Archiving DVDs with OGMrip"
layout: post
date:   2014-08-26 07:11:00
excerpt: <p><img alt="ember rest" class="image" src="http://www.thehoick.com/images/ogmrip/ogmrip_website.png"/> </p>
categories: emberjs
---


<p><img alt="ember rest" class="image" src="http://www.thehoick.com/images/ogmrip/ogmrip_website.png"/> </p>


# Ripping DVDs with OGMRip

[OGMRip](http://ogmrip.sourceforge.net/en/index.html) has been my go to tool for backing up DVDs for a couple of years now.  Unless there are major scratches on the disc I haven't had any trouble archiving a movie.

## Installing OGMRip

OGMRip is a Linux only tool so if you're running Mac or Windows you may be able to get it running if you use some type of emulator or maybe with GnuWin.  

We'll cover getting things setup on Ubuntu 14.04 LTS, but the steps should be roughly similar for other distributions.  You'll just have to adjust the commands and package names for your particular distro.

To install OGMRip on Ubuntu enter the following into a terminal:

```
sudo apt-get install ogmrip
```

There will be some additional dependencies so go ahead and install them as well.

## Reading DVDs

Before you can fire up OGMRip and actually archive the DVD, or even play a DVD on Ubuntu you'll need to install some additional packages.

The [Restricted Formats/Plauing DVDs](https://help.ubuntu.com/community/RestrictedFormats/PlayingDVDs) wiki page has in depth details enabling DVD playback.

The quick and dirty is:

```
sudo apt-get install libdvdread4
```

Then:

```
sudo /usr/share/doc/libdvdread4/install-css.sh
```

Once that's finished you may need to reboot, but you should now be able to play DVDs in the movie player, or another player like VLC.  Also, OGMRip will now be able to properly read the disc.

## Archiving a DVD

Now that all the necessary packages are installed go ahead and fire up the OGMRip graphical interface.  You can do that through the Dash menu.

* Click the Ubuntu icon in the upper left hand corner of the screen.
* Type **ogmrip** in the search field.
* Click the icon for *OGMRip* in the search results.

![](http://www.thehoick.com/images/ogmrip/ogmrip_dash.png)

OGMRip will now open and will be ready to archive.

![](http://www.thehoick.com/images/ogmrip/ogmrip_blank.png)


To acrchive a DVD click the "Load" button and select the DVD from the drop down (assuming you have a DVD in the drive).

![](http://www.thehoick.com/images/ogmrip/ogmrip_loading.png)

---

You can also archive a DVD from an ISO file.  This can be handy if OGMRip can't read a disc, but you can make an archive using a disc tool like [Brasero](https://wiki.gnome.org/Apps/Brasero).

---

Once a DVD is loaded click the "Extract" button.  This will bring up the format window which allows you to choose what type of file you'd like to archive the DVD to.

![](http://www.thehoick.com/images/ogmrip/ogmrip_extract.png)

I have had the most luck with archiving to either the profile for *"Google Nexus One"* which creates an MP4 file, or the *"DivX For Standalone Player"* profile.  The *DivX* profile archives to an AVI file which has a small size, but doesn't work with modern HTML5 video players as well as MP4.  Also, the AVI file isn't as clear as a MP4 archive.


After selecting the archive type you would like to create simply click the "Extract" button to start the process.

![](http://www.thehoick.com/images/ogmrip/ogmrip_extracting.png)

Now kick back and wait.  I find the process tends to go faster if I'm not sitting there watching the progress bar... Maybe there's some type of parable here?

## Conclusion

OGMRip is a great tool to archive your DVD collection, and if you select an export format like MP4 you can easily view your archive files in the [DVD Pila!](http://dvdpila.thehoick.com) project.  Also, selecting a format like MP4 allows the files to be played with a wide range of software like VLC, Windows Media Player, and Quicktime.

Party On!

