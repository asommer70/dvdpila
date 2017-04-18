var express = require('express');
var router = express.Router();
var DvdsController = require('../controllers/dvds_controller');

/* GET home page. */
router.get('/', DvdsController.index);
router.get('/api/dvds', DvdsController.api.index);
router.get('/dvds/add', DvdsController.add);
router.get('/dvds/:id', DvdsController.dvd);


router.post('/dvds', DvdsController.create);

router.put('/dvds/:id', DvdsController.edit);

router.delete('/dvds/:id', DvdsController.delete);


module.exports = router;
