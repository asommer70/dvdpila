var https = require('https');
var fs = require('fs');

var contextMenu = fs.createWriteStream("public/javascripts/plugins/context-menu.min.js");
var request = https.get("https://raw.githubusercontent.com/mediaelement/mediaelement-plugins/master/dist/context-menu/context-menu.min.js", function(response) {
  response.pipe(contextMenu);
});

var contextMenuCSS = fs.createWriteStream("public/stylesheets/context-menu.min.css");
var request = https.get("https://raw.githubusercontent.com/mediaelement/mediaelement-plugins/master/dist/context-menu/context-menu.min.css", function(response) {
  response.pipe(contextMenuCSS);
});

var markers = fs.createWriteStream("public/javascripts/plugins/markers.min.js");
var request = https.get("https://raw.githubusercontent.com/mediaelement/mediaelement-plugins/master/dist/markers/markers.min.js", function(response) {
  response.pipe(markers);
});

var speed = fs.createWriteStream("public/javascripts/plugins/speed.min.js");
var request = https.get("https://raw.githubusercontent.com/mediaelement/mediaelement-plugins/master/dist/speed/speed.min.js", function(response) {
  response.pipe(speed);
});

var speedCSS = fs.createWriteStream("public/stylesheets/speed.min.css");
var request = https.get("https://raw.githubusercontent.com/mediaelement/mediaelement-plugins/master/dist/speed/speed.min.css", function(response) {
  response.pipe(speedCSS);
});
