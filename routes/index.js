var express = require('express');
var router = express.Router();
var multer  = require('multer')
var DvdsController = require('../controllers/dvds_controller');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/posters/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage });


/* GET home page. */
router.get('/', DvdsController.index);
router.get('/api/dvds', DvdsController.api.index);
router.get('/dvds/add', DvdsController.add);
router.get('/dvds/:id', DvdsController.dvd);
router.get('/dvds/:id/edit', DvdsController.editDvd);

router.post('/dvds', DvdsController.create);

router.put('/api/dvds/:id', upload.single('image'), DvdsController.edit);

router.delete('/api/dvds/:id', DvdsController.delete);


module.exports = router;
