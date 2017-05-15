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
    const youtubeIds = {};
    const ol = findNodeByName('ol', document);

    ol.forEach((node) => {
      const links = findNodeByName('a', node);

      links.forEach((link) => {
        // console.log('link.childNodes:', link.childNodes);
        let youtubeId;

        link.attrs.forEach((attr) => {
          if (attr.name == 'href') {
            if (attr.value.substr(0, 6) === '/watch') {
              youtubeId = attr.value.split('v=')[1];

              if (!youtubeIds.hasOwnProperty(youtubeId)) {
                // TODO:as get the title attribute for the link and create an object then push the object to the array.
                //
                // TODO:as maybe also get a link to the trailer image and add it to the object.
                // https://i.ytimg.com/vi/GjwfqXTebIY/hqdefault.jpg
                // https://i.ytimg.com/vi/3cxixDgHUYw/hqdefault.jpg
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

          // console.log('title:', link.childNodes[0].value);
        }
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
