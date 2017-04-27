var express = require('express');
var router = express.Router();
var multer  = require('multer')
var DvdsController = require('../controllers/dvds_controller');
var TagsController = require('../controllers/tags_controller');

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
router.get('/dvds/add', DvdsController.addDvd); // This route had to come before /dvd/:id route.
router.get('/dvds/:id', DvdsController.dvd);
router.get('/dvds/:id/edit', DvdsController.editDvd);
router.get('/tags/:name', TagsController.dvds);
router.get('/api/dvds', DvdsController.api.index);
router.get('/api/dvds/:id', DvdsController.api.dvd);
router.get('/api/dvds/:dvdId/episode/:episodeId', DvdsController.api.episode);

router.post('/dvds', upload.single('image'), DvdsController.create);
router.post('/dvds/bookmarks', DvdsController.createBookmark);
router.post('/dvds/episodes', DvdsController.createEpisode);
router.post('/tags', DvdsController.createTag);
router.post('/search', DvdsController.search);

router.put('/api/dvds/:id', upload.single('image'), DvdsController.api.updateDvd);
router.put('/api/dvds/:dvdId/episode/:episodeId', DvdsController.api.updateEpisode);

router.delete('/api/dvds/:id', DvdsController.api.deleteDvd);

module.exports = router;
