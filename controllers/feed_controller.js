const parser = require('rss-parser');
const parse5 = require('parse5');
const https = require('https');

const filmjabber = 'http://feeds.filmjabber.com/UpcomingDVD?format=xml';
const netflix = 'http://dvd.netflix.com/NewReleasesRSS';
const movies = 'http://www.movies.com/rss-feeds/new-on-dvd-rss';
const youtube = 'https://www.youtube.com/results?search_query=official+trailer';

module.exports = {
  index(req, res, next) {

    parser.parseURL(netflix, (err, parsed) => {
      const dvds = parsed.feed.entries.map((entry) => {
        const fragment = parse5.parseFragment(entry.content);
        entry.imageUrl = fragment.childNodes[0].childNodes[0].attrs[0].value.replace('small', 'large');
        return entry;
      });

      parser.parseURL(movies, (err, moviesParsed) => {
        getYoutubeTrailers((trailers) => {
          res.render('upcoming', {netflix: dvds, movies: moviesParsed.feed.entries, trailers: trailers});
        });
      });
    });
  },
}

function getParams(str) {
  var params = str.split(';').reduce(function (params, param) {
    var parts = param.split('=').map(function (part) { return part.trim(); });
    if (parts.length === 2) {
      params[parts[0]] = parts[1];
    }
    return params;
  }, {});
  return params;
}

function getYoutubeTrailers(callback) {
  const request = https.get(youtube, function(response) {
    let body = '';

    response.on('data', (chunk) => {
        body += chunk;
    });

    response.on('end', () => {

      const document = parse5.parse(body);
      const youtubeIds = {};
      const ol = findNodeByName('ol', document);

      ol.forEach((node) => {
        const links = findNodeByName('a', node);

        links.forEach((link) => {
          let youtubeId;

          link.attrs.forEach((attr) => {
            if (attr.name == 'href') {
              if (attr.value.substr(0, 6) === '/watch') {
                youtubeId = attr.value.split('v=')[1];

                if (!youtubeIds.hasOwnProperty(youtubeId)) {
                  youtubeIds[youtubeId] = {
                    id: youtubeId,
                    img: 'https://i.ytimg.com/vi/' + youtubeId + '/hqdefault.jpg',
                    url: 'https://www.youtube.com/embed/' + youtubeId
                  };
                }
              }
            }
          });

          if (link.childNodes[0].nodeName == '#text') {
            if (youtubeIds.hasOwnProperty(youtubeId)) {
              if (!youtubeIds[youtubeId].title) {
                youtubeIds[youtubeId].title = link.childNodes[0].value;
              }
            }
          }
        });
      });

      callback(youtubeIds);
    }); // end response.on end
  });
}


function findNodeByName(name, node, matches = []) {
  if (node.nodeName == name) {
    matches.push(node);
  }

  node.childNodes.forEach((node) => {
    if (node.nodeName == name) {
      // Only add the node once.
      const matched = matches.findIndex((node) => {
        if (node.nodeName == name) {
          return true;
        }
      });

      if (matched !== -1) {
        matches.push(node);
      }
    }

    if (node.childNodes) {
      return findNodeByName(name, node, matches);
    }
  });

  return matches;
}
