const Dvd = require('../models/dvd');

module.exports = {
  index(req, res, next) {
    Dvd.find({})
    .skip((parseInt(req.query.page) - 1) * 10)
    .limit(10)
    .then((dvds) => {
      res.render('index', {dvds});
    });
  },

  dvd(req, res, next) {
    console.log('req.params:', req.params);
    Dvd.findById(req.params.id)
      .then((dvd) => {
        if (dvd === null) {
          res.redirect(404, '/', {flash: 'DVD not found.'});
        }
        res.render('dvd', {dvd});
      })
  },

  add(req, res, next) {
    res.render('dvd_edit', { dvd: new Dvd({}) });
  },

  create(req, res, next) {
    const dvd = new Dvd(req.body)
    dvd.save()
      .then(() => {
        res.redirect(302, '/dvds/' + dvd._id);
      })
      .catch((err) => {
        console.log('create err:', err);
        next();
      });
  },

  edit(req, res, next) {
    Dvd.findByIdAndUpdate(req.params.id, req.body)
      .then(() => Dvd.findById(req.params.id))
      .then((dvd) => {
        res.render('/dvds/' + dvd._id, {flash: 'DVD: ' + dvd.title + ' updated.', dvd});
      })
      .catch(() => next);
  },

  delete(req, res, next) {
    Dvd.findByIdAndRemove(req.params.id)
      .then((dvd) => {
        res.redirect(204, '/dvds', {flash: 'DVD ' + dvd.title + ' deleted.'});
      })
      .catch(() => next);
  },

  api: {
    index(req, res, next) {
      Dvd.find({})
      .skip(req.query.page * 2)
      .limit(10)
      .then((dvds) => {
        res.json(dvds);
      });
    }
  }
}
