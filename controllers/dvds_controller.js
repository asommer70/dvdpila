const http = require('http');
const https = require('https');
const fs = require('fs');
const moment = require('moment');
const Dvd = require('../models/dvd');
const Episode = require('../models/episode_schema');
const Tag = require('../models/tag_schema');


module.exports = {
  index(req, res, next) {
    Dvd.count({}, (err, count) => {
      Dvd.find({})
        .populate('tags')
        .sort({updatedAt: -1})
        .skip((parseInt(req.query.page) - 1) * 10)
        .limit(10)
        .then((dvds) => {
          res.render('index', {dvds, currentPage: parseInt(req.query.page) || 1, maxPages: Math.ceil(count / 10)});
        });
    })
  },

  search(req, res, next) {
    Dvd.find({ title: { $regex: new RegExp(req.body.term, 'ig') } })
      .then((dvds) => {
        res.render('search', {term: req.body.term, dvds});
      })
      .catch((err) => {
        console.log('Search err:', err);
      })
  },

  show(req, res, next) {
    Dvd.findById(req.params.id).populate('tags')
      .then((dvd) => {
        if (dvd === null) {
          res.redirect(404, '/', {flash: 'DVD not found.'});
        }
        dvd.createdFromNow = moment(dvd.createdAt).fromNow();
        res.render('dvd', {dvd});
      })
  },

  addDvd(req, res, next) {
    res.render('dvd_edit', { dvd: new Dvd({}) });
  },

  editDvd(req, res, next) {
    Dvd.findById(req.params.id)
    .then((dvd) => {
      res.render('dvd_edit', {dvd});
    })
    .catch(() => next);
  },

  create(req, res, next) {
    if (req.file) {
      req.body.imageUrl = '/images/posters/' + req.file.originalname
    }

    const dvd = new Dvd(req.body)
    dvd.save()
      .then(() => Dvd.findOne({title: req.body.title}))
      .then((dvd) => {
        res.redirect(302, '/dvds/' + dvd._id);
      })
      .catch((err) => {
        console.log('create err:', err);
        next();
      });
  },

  createBookmark(req, res, next) {
    Dvd.findById(req.body.dvdId)
      .then((dvd) => {
        if (req.body.episodeId) {
          const episode = dvd.episodes.id(req.body.episodeId);
          episode.bookmarks.push({name: req.body.name, time: req.body.time});
        } else {
          dvd.bookmarks.push({name: req.body.name, time: req.body.time});
        }

        dvd.save()
          .then(() => {
            res.redirect(302, '/dvds/' + dvd._id);
          })
          .catch((err) => {
            console.log('createBookmark err:', err);
            next();
          })
      });
  },

  createEpisode(req, res, next) {
    Dvd.findById(req.body.dvdId)
      .then((dvd) => {
        dvd.episodes.push({name: req.body.name, fileUrl: req.body.fileUrl});
        dvd.save()
          .then(() => {
            res.redirect(302, '/dvds/' + dvd._id);
          })
          .catch((err) => {
            console.log('createEpisode err:', err);
            next();
          })
      });
  },

  createTag(req, res, next) {
    Dvd.findById(req.body.dvdId)
      .then((dvd) => {
        req.body.tagList.replace(/\s/g, '').split(',').forEach((tagStr) => {
          const tagged = dvd.tags.findIndex((tag) => {
            if (tag.name === tagStr) {
              return true;
            }
            return false;
          });

          if (tagged === -1) {
            dvd.tags.push({name: tagStr});
          }
        });

        dvd.save()
          .then(() => {
            res.redirect(302, '/dvds/' + dvd._id);
          })
          .catch((err) => console.log('createTag dvd.save err:', err));
      });
  },

  omdb(req, res, next) {
    url = "http://www.omdbapi.com/?t=" + req.body.title.replace(/\s/, '+') + "&y=&plot=short&r=json";

    var request = http.get(url, function(response) {
      var body = '';

      response.on('data', (chunk) => {
          body += chunk;
      });

      response.on('end', () => {
          var data = JSON.parse(body);

          if (data.Poster) {
            const filename = data.Title.replace(/\'/g, '').replace(/\s/g, '_') + '.jpg';
            const poster = fs.createWriteStream("public/images/posters/" + filename);
            var request = https.get(data.Poster, function(imgRes) {
              imgRes.pipe(poster);
              data.imageUrl = '/images/posters/' + filename;
              res.json(data);
            });
          }
      });
    });
  },

  api: {
    index(req, res, next) {
      Dvd.find({})
        .populate('tags')
        .sort({updatedAt: -1})
        .skip(req.query.page * 2)
        .limit(10)
        .then((dvds) => {
          res.json(dvds);
        });
    },

    show(req, res, next) {
      Dvd.findById(req.params.id)
        .populate('tags')
        .then((dvd) => {
          if (dvd === null) {
            res.status(404).json({message: 'DVD not found...'});
          }
          dvd.createdFromNow = moment(dvd.createdAt).fromNow();
          res.status(200).json({dvd});
        })
    },

    updateDvd(req, res, next) {
      if (req.file) {
        req.body.imageUrl = '/images/posters/' + req.file.originalname
      }

      Dvd.findByIdAndUpdate(req.params.id, req.body)
        .then(() => Dvd.findById(req.params.id))
        .then((dvd) => {
          res.json({flash: 'DVD: ' + dvd.title + ' updated.', dvd});
        })
        .catch(() => next);
    },

    deleteDvd(req, res, next) {
      Dvd.findByIdAndRemove(req.params.id)
        .then((dvd) => {
          res.json({flash: 'DVD ' + dvd.title + ' deleted.'});
        })
        .catch(() => next);
    },

    episode(req, res, next) {
      Dvd.findById(req.params.dvdId)
        .then((dvd) => {
          if (dvd === null) {
            res.status(404).json({message: 'DVD not found...'});
          }
          const episode = dvd.episodes.id(req.params.episodeId);
          episode.createdFromNow = moment(episode.createdAt).fromNow();
          res.status(200).json({episode});
        })
    },

    updateEpisode(req, res, next) {
      Dvd.findById(req.params.dvdId)
      .then((dvd) => {
        const episode = dvd.episodes.id(req.params.episodeId);
        episode.playbackTime = req.body.playbackTime;
        dvd.save()
          .then(() => res.json({flash: 'Episode: ' + episode.name + ' updated.', episode}))
      })
      .catch(() => next);
    },
  },
}
