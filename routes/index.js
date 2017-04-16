var express = require('express');
var router = express.Router();
const Dvd = require('../models/dvd');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dvds/add', function(req, res, next) {
  res.render('dvd_edit', { dvd: new Dvd({}) });
});


router.post('/dvds/add', function(req, res, next) {
  console.log('req.body:', req.body);
  const dvd = new Dvd(req.body);
  dvd.save()
    .then(() => {
      res.redirect('/', {flash: 'DVD ' + dvd.title + ' created.'});
    })
    .catch((err) => {
      console.log('err:', err);
      res.redirect('/', {flash: 'Problem creating the DVD: ' + err.message});
    });
});


module.exports = router;
