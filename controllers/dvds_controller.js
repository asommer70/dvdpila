const moment = require('moment');
const Dvd = require('../models/dvd');
const Episode = require('../models/episode_schema');
const Tag = require('../models/tag');

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

  dvd(req, res, next) {
    Dvd.findById(req.params.id).populate('tags')
      .then((dvd) => {
        if (dvd === null) {
          res.redirect(404, '/', {flash: 'DVD not found.'});
        }
        dvd.createdFromNow = moment(dvd.createdAt).fromNow();
        res.render('dvd', {dvd});
      })
  },

  dvdJson(req, res, next) {
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

  episodeJson(req, res, next) {
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

  add(req, res, next) {
    res.render('dvd_edit', { dvd: new Dvd({}) });
  },

  create(req, res, next) {
    if (req.file) {
      req.body.imageUrl = '/images/posters/' + req.file.originalname
    }

    const dvd = new Dvd(req.body)
    dvd.save()
      .then(() => Dvd.findOne({title: req.body.title}))
      .then((dvd) => {
        // dvd.update({playbackTime: 0});
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
        req.body.tagList.split(', ').map((tagStr) => {
          Tag.findOne({name: tagStr})
            .then((tag) => {
              if (!tag) {
                tag = new Tag({name: tagStr});
              }

              dvd.tags.push(tag);
              tag.dvds.push(dvd);

              Promise.all([dvd.save(), tag.save()])
                .then(() => res.redirect(302, '/dvds/' + dvd._id))
                .catch(() => next);
            })
            .catch((err) => console.log('Tag.find err:', err));
        });
      });
  },

  editDvd(req, res, next) {
    Dvd.findById(req.params.id)
    .then((dvd) => {
      res.render('dvd_edit', {dvd});
    })
    .catch(() => next);
  },

  updateDvd(req, res, next) {
    if (req.file) {
      req.body.imageUrl = '/images/posters/' + req.file.originalname
    }
    console.log('req.body:', req.body);

    Dvd.findByIdAndUpdate(req.params.id, req.body)
      .then(() => Dvd.findById(req.params.id))
      .then((dvd) => {
        res.json({flash: 'DVD: ' + dvd.title + ' updated.', dvd});
      })
      .catch(() => next);
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

  delete(req, res, next) {
    Dvd.findByIdAndRemove(req.params.id)
      .then((dvd) => {
        res.json({flash: 'DVD ' + dvd.title + ' deleted.'});
      })
      .catch(() => next);
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
    }
  }
}