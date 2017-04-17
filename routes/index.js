var express = require('express');
var router = express.Router();
var DvdsController = require('../controllers/dvds_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dvds/add', DvdsController.add);


router.post('/dvds', DvdsController.create);


module.exports = router;
