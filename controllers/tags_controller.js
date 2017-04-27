const Dvd = require('../models/dvd');
const Tag = require('../models/tag_schema');

module.exports = {
  dvds(req, res, next) {
    Dvd.find({'tags.name': req.params.name})
      .then((dvds) => {
        res.render('dvds_for_tag', {tag: req.params.name, dvds: dvds});
      });
  },
}
