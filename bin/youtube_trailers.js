const parse5 = require('parse5');
const https = require('https');

const youtube = 'https://www.youtube.com/results?search_query=official+trailer';

const request = https.get(youtube, function(response) {
  let body = '';

  response.on('data', (chunk) => {
      body += chunk;
  });

  response.on('end', () => {

    const document = parse5.parse(body);
    const youtubeIds = [];
    const ol = findNodeByName('ol', document);

    ol.forEach((node) => {
      const links = findNodeByName('a', node);

      links.forEach((link) => {
        link.attrs.forEach((attr) => {
          if (attr.name == 'href') {
            if (attr.value.substr(0, 6) === '/watch') {
              const youtubeId = attr.value.split('v=')[1];

              if (youtubeIds.indexOf(youtubeId) === -1) {
                youtubeIds.push(youtubeId);
              }
            }
          }
        });
      });
    });

    console.log('youtubeIds:', youtubeIds);

  }); // end response.on end
});


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
