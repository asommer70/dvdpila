const https = require('https');
const fs = require('fs');

const searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
const pagepropsUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&format=json&titles=';
const imageUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=Image:';
const plotUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

module.exports = {
  search: function(term, callback) {
    var request = https.get(searchUrl + term, function(response) {
      var body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        const data = JSON.parse(body);
        callback(data);
      });
    });
  },

  getImageName: function(pageUrl, callback) {
    const parts = pageUrl.split('/');
    const title = parts[parts.length - 1];

    var request = https.get(pagepropsUrl + title, function(response) {
      var body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        var data = JSON.parse(body);
        const pageId = Object.keys(data.query.pages)[0];
        const pageprops = data.query.pages[pageId].pageprops
        if (pageprops !== undefined) {
          callback(null, {imageName: pageprops.page_image, title: title});
        } else {
          callback(new Error('Could not find imageName...'), null);
        }
      });
    });
  },

  getImageUrl: function(imageName, callback) {
    https.get(imageUrl + imageName, function(response) {
      var body = '';
      if (response.statusCode == 400) {
        callback(new Error('Problem getting ImageUrl: ' + imageUrl + imageName), null);
      }

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        if (body) {
          var data = JSON.parse(body);
          const pageId = Object.keys(data.query.pages)[0];
          if (pageId == -1) {
            callback(new Error('Could not find pageId...'), null);
          } else {
            callback(null, data.query.pages[pageId].imageinfo[0].url);
          }
        }
      });
    }).on('error', (err) => {
      console.log('getImageUrl request err:', err);
    });
  },

  downloadImage: function(imageUrl, imageName, callback) {
    var filename = imageName.replace(')', '').replace('(', '');
    var imageFile = fs.createWriteStream('public/images/posters/' + filename);
    var request = https.get(imageUrl, function(response) {
      response.pipe(imageFile);
      callback('/images/posters/' + filename);
    });
  },

  getPlot: function(title, callback) {
    var request = https.get(plotUrl + title, function(response) {
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

        callback(plot);
      });
    });
  }
}
