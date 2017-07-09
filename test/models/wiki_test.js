const assert = require('assert');
const https = require('https');

describe('Parsing Wikipedia', () => {
  it('searches for a DVD title', (done) => {
    const title = 'Soldier';
    const url = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + title;

    var request = https.get(url, function(response) {
      var body = '';

      response.on('data', (chunk) => {
          body += chunk;
      });

      response.on('end', () => {
          var data = JSON.parse(body);
          assert(data[1][7] === 'Soldier (1998 American film)');
          done();
      });
    });
  });

  it('can find name for DVD poster image', (done) => {
    const pagePath = 'https://en.wikipedia.org/wiki/Soldier_(1998_American_film)';
    const parts = pagePath.split('/');
    const title = parts[parts.length - 1];
    const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&format=json&titles=' + title;

    var request = https.get(url, function(response) {
      var body = '';

      response.on('data', (chunk) => {
          body += chunk;
      });

      response.on('end', () => {
          var data = JSON.parse(body);
          const pageId = Object.keys(data.query.pages)[0];
          assert(data.query.pages[pageId].pageprops.page_image == 'Soldier_(1998)_poster.jpg');
          done();
      });
    });
  });

  it('can find URL for DVD poster image', (done) => {
    const title = 'Soldier_(1998)_poster.jpg';
    const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=Image:' + title;

    var request = https.get(url, function(response) {
      var body = '';

      response.on('data', (chunk) => {
          body += chunk;
      });

      response.on('end', () => {
          var data = JSON.parse(body);
          const pageId = Object.keys(data.query.pages)[0];
          assert(data.query.pages[pageId].imageinfo[0].url == 'https://upload.wikimedia.org/wikipedia/en/e/e9/Soldier_%281998%29_poster.jpg');
          done();
      });
    });
  });

  it('can parse wiki text from page content', (done) => {
    const title = 'Soldier_(1998_American_film)';
    const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=' + title;
    const para = "\nIn 1996, as part of a new military training program, a group of orphaned infants are selected at birth and raised as highly disciplined soldiers with no understanding of anything but military routine. They are trained to be ruthless obedient killers, and all those considered to be physically or mentally unworthy are executed. The survivors are turned into impassive dedicated fighting machines with no exposure to or understanding of the outside world."

    var request = https.get(url, function(response) {
      var body = '';

      response.on('data', (chunk) => {
          body += chunk;
      });

      response.on('end', () => {
          var data = JSON.parse(body);
          const pageId = Object.keys(data.query.pages)[0];
          const content = data.query.pages[pageId].revisions[0]['*'];
          const contentParts = content.split("\n\n");
          let plot;
          contentParts.forEach((part) => {
            if (part.split("\n")[0] == '==Plot==') {
              plot = part.replace('==Plot==', '');
            }
          });
          assert(plot == para);
          done();
      });
    });
  });
});
