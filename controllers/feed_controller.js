const parser = require('rss-parser');
const parse5 = require('parse5');
const https = require('https');

module.exports = {
  index(req, res, next) {

    const filmjabber = 'http://feeds.filmjabber.com/UpcomingDVD?format=xml';
    const netflix = 'http://dvd.netflix.com/NewReleasesRSS';
    const movies = 'http://www.movies.com/rss-feeds/new-on-dvd-rss';
    const youtube = 'https://www.youtube.com/results?search_query=official+trailer';

    parser.parseURL(netflix, (err, parsed) => {
      const dvds = parsed.feed.entries.map((entry) => {
        const fragment = parse5.parseFragment(entry.content);
        entry.imageUrl = fragment.childNodes[0].childNodes[0].attrs[0].value.replace('small', 'large');
        return entry;
      });

      parser.parseURL(movies, (err, moviesParsed) => {

        const request = https.get(youtube, function(response) {
          let body = '';

          response.on('data', (chunk) => {
              body += chunk;
          });

          response.on('end', () => {

            const document = parse5.parse(body);
            console.log('document:', document);
            document.childNodes.forEach((node) => {
              console.log('node:', node);
            });
            // entry.imageUrl = fragment.childNodes[0].childNodes[0].attrs[0].value.replace('small', 'large');
            // return entry;

            res.render('upcoming', {netflix: dvds, movies: moviesParsed.feed.entries});

          }); // end response.on end
        });
      });


      // res.render('upcoming', {netflix: dvds});
    });

    // var feed_req = request('http://feeds.filmjabber.com/UpcomingDVD?format=xml', {timeout: 10000, pool: false});
    // feed_req.setMaxListeners(50);
    // // Some feeds do not respond without user-agent and accept headers.
    // feed_req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
    // feed_req.setHeader('accept', 'text/html,application/xhtml+xml');
    // var feedparser = new FeedParser();
    //
    // // Define our handlers
    // feed_req.on('error', (err) => console.log('feed_req err:', err));
    //
    // // Get the feed XML and parse it with FeedParser.
    // feed_req.on('response', (feed_res) => {
    //   if (feed_res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
    //   var charset = getParams(feed_res.headers['content-type'] || '').charset;
    //   // feed_res = maybeTranslate(res, charset);
    //   // And boom goes the dynamite
    //   feed_res.pipe(feedparser);
    // });
    //
    // feedparser.on('error', (err) => {
    //   console.log('feedparser err:', err);
    //   next();
    // });
    // feedparser.on('end', (err) => console.log('feedparser end err:', err));
    //
    // feedparser.on('meta', (data) => {
    //   // console.log('data:', data);
    //   // callback(data);
    // })
    //
    // feedparser.on('readable', () => {
    //   // This is where the action is!
    //   var stream = feedparser; // `this` is `feedparser`, which is a stream
    //   var meta = feedparser.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    //   var item;
    //
    //   var dvds = [];
    //   while (item = stream.read()) {
    //     console.log(item.title);
    //     // dvds.push(item);
    //   }
    //   res.render('upcoming');
    // });
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
