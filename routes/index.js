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
router.get('/api/dvds', DvdsController.api.index);
router.get('/dvds/add', DvdsController.add);
router.get('/dvds/:id', DvdsController.dvd);
router.get('/dvds/:id/edit', DvdsController.editDvd);
router.get('/tags', TagsController.index);
router.get('/tags/:name', TagsController.dvds);
router.get('/api/dvds/:id', DvdsController.dvdJson);
router.get('/api/dvds/:dvdId/episode/:episodeId', DvdsController.episodeJson);

router.post('/dvds', upload.single('image'), DvdsController.create);
router.post('/dvds/bookmarks', DvdsController.createBookmark);
router.post('/dvds/episodes', DvdsController.createEpisode);
router.post('/tags', DvdsController.createTag);

router.put('/api/dvds/:id', upload.single('image'), DvdsController.updateDvd);
router.put('/api/dvds/:dvdId/episode/:episodeId', DvdsController.updateEpisode);

router.delete('/api/dvds/:id', DvdsController.delete);

module.exports = router;
