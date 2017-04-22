const moment = require('moment');
const Dvd = require('../models/dvd');

module.exports = {
  index(req, res, next) {
    Dvd.count({}, (err, count) => {
      Dvd.find({})
      .sort({updatedAt: -1})
      .skip((parseInt(req.query.page) - 1) * 10)
      .limit(10)
      .then((dvds) => {
        res.render('index', {dvds, currentPage: parseInt(req.query.page) || 1, maxPages: Math.ceil(count / 10)});
      });
    })
  },

  dvd(req, res, next) {
    Dvd.findById(req.params.id)
      .then((dvd) => {
        dvd.createdFromNow = moment(dvd.createdAt).fromNow();
        if (dvd === null) {
          res.redirect(404, '/', {flash: 'DVD not found.'});
        }
        res.render('dvd', {dvd});
      })
  },

  dvdJson(req, res, next) {
    Dvd.findById(req.params.id)
      .then((dvd) => {
        dvd.createdFromNow = moment(dvd.createdAt).fromNow();
        if (dvd === null) {
          res.status(404).json({message: 'DVD not found...'});
        }
        res.status(200).json({dvd});
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
        dvd.bookmarks.push({name: req.body.name, time: req.body.time});
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

  editDvd(req, res, next) {
    Dvd.findById(req.params.id)
    .then((dvd) => {
      res.render('dvd_edit', {dvd});
    })
    .catch(() => next);
  },

  edit(req, res, next) {
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
      .sort({updatedAt: -1})
      .skip(req.query.page * 2)
      .limit(10)
      .then((dvds) => {
        res.json(dvds);
      });
    }
  }
}
