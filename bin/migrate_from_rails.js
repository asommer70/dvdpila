const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');
const Dvd = require('../models/dvd');
const Episode = require('../models/episode_schema');
const Tag = require('../models/tag_schema');

// Connect to MongoDB.
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/dvdpila_dev');
}

// Hard coded endPage for current DVD Pila! database.
let page = 1;
// const endPage = 5;
const endPage = 83;

while (page < endPage) {
  const request = http.get("http://dvdpila/dvds.json?page=" + page, function(response) {
    // response.pipe(contextMenu);
    var body = '';

    response.on('data', (chunk) => {
        body += chunk;
    });

    response.on('end', () => {
        var dvds = JSON.parse(body);

        if (dvds.length) {
          dvds.forEach((dvd) => {
            console.log('dvd.title:', dvd.title);

            const newDvd = new Dvd({
              title: dvd.title,
              rating: dvd.rating,
              abstractTxt: dvd.abstract_txt,
              abstractSource: dvd.abstract_source,
              abstarctUrl: dvd.abstract_url,
              fileUrl: dvd.fileUrl,
              playbackTime: dvd.playback_time,
              tags: [],
              episodes: [],
              bookmarks: []
            });

            if (dvd.tags.length) {
              dvd.tags.forEach((tag) => {
                newDvd.tags.push({name: tag.name})
              });
            }

            if (dvd.bookmarks.length) {
              dvd.bookmarks.forEach((bookmark) => {
                newDvd.bookmarks.push({name: bookmark.name, time: bookmark.time})
              });
            }

            if (dvd.episodes.length) {
              dvd.episodes.forEach((episode) => {
                const newEpisode = {
                  name: episode.name,
                  fileUrl: episode.file_url,
                  playbackTime: episode.playback_time,
                  bookmarks: []
                }

                if (episode.bookmarks.length) {
                  episode.bookmarks.forEach((bookmark) => {
                    newEpisode.bookmarks.push({name: bookmark.name, time: bookmark.time})
                  });
                }

                newDvd.episodes.push(newEpisode)
              });
            }

            const filename = dvd.title.replace(/\'/g, '').replace(/\s/g, '_').replace(/\)/g, '').replace(/\(/g, '').replace(/\//g, '_') + '.jpg';
            const poster = fs.createWriteStream("public/images/posters/" + filename);

            var request = http.get("http://dvdpila" + dvd.image_url, function(response) {
              response.pipe(poster);
            });

            newDvd.imageUrl = '/images/posters/' + filename;
            newDvd.save()
              .then(() => {
                return;
              })
              .catch((err) => console.log('newDvd.save err:', err));
          });
        } // end if dvds.length

    }); // end response.on end
  });

  page++;
}
