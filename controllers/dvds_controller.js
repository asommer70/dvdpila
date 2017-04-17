const Dvd = require('../models/dvd');

module.exports = {
  add(req, res, next) {
    res.render('dvd_edit', { dvd: new Dvd({}) });
  },

  create(req, res, next) {
    // console.log('req.body:', req.body);
    // const dvd = new Dvd(req.body);
    Dvd.create(req.body)
      .then((dvd) => {
        res.redirect(302, '/', {flash: 'DVD ' + dvd.title + ' created.'});
      })
      .catch((err) => {
        console.log('err:', err);
        next();
        // res.redirect(302, '/', {flash: 'Problem creating the DVD: ' + err.message});
      });
  }
}
