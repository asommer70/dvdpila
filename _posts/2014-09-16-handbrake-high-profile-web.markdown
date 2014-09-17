---
layout: post
title: "Handbrake High Profile With Sound For The Web"
date:   2014-09-16 17:09:05
excerpt: <p><img alt="handbrake" class="post-image" src="http://www.thehoick.com/images/handbrake/handbrake_audio.png"/></p>
categories: emberjs
---

<p><img alt="handbrake" class="post-image" src="http://www.thehoick.com/images/handbrake/handbrake_audio.png"/></p>

The [Handbrake](https://handbrake.fr/) "High
Profile" creates a great looking video file that
also sounds great.  Well until you try to play it
in a HTML5 *video* element.  Then you don't get
any sound at all.  It's a codec issue... I think.

### Adjusting the High Profile

Change the audio codec for the **High Profile** to
allow sound on the web.  First, open Handbrake and
select a *Source* to archive.

![](http://www.thehoick.com/images/handbrake/handbrake_source.png)

Next, select the High Profile in the **Presets**
pane.

![](http://www.thehoick.com/images/handbrake/handbrake_presets.png)

Click the **Audio** tab:

![](http://www.thehoick.com/images/handbrake/handbrake_audio.png)

Change the **Codec** to **AAC (ffmpeg)** by
clicking the **Encoder** dropdown, and make sure
the *Bitrate* is 160:

![](http://www.thehoick.com/images/handbrake/handbrake_encoder.png)

Click the **Save** icon in the *Presets* pane and
choose a name for the new preset. I chose "High
Profile Web" cause I'm descriptive like that.

### Conclusion

That's all there is to it.  Now when you select
the new profile and click the **Start** button the
DVD will be archived and use the new AAC (ffmpeg)
codec.  The sound works for me in the Google
Chrome browser, but your mileage may vary.
