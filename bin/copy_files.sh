#!/bin/bash
#
# Copy JavaScript and CSS files from node_modules to public/.
#
cp ./node_modules/mediaelement/build/mediaelement-and-player.min.js ./public/javascripts/
cp ./node_modules/jquery/dist/jquery.min.js ./public/javascripts/
cp ./node_modules/foundation-sites/dist/js/foundation.min.js ./public/javascripts/

cp ./node_modules/mediaelement/build/mediaelementplayer.min.css ./public/stylesheets
cp ./node_modules/mediaelement/build/mejs-controls.svg ./public/stylesheets
