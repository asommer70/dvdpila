const Dvd = require('../models/dvd');
const Tag = require('../models/tag_schema');

module.exports = {
  dvds(req, res, next) {
    Tag.findOne({name: req.params.name})
      .populate('dvds')
      .then((tag) => {
        res.render('dvds_for_tag', {tag});
      });
  },

  index(req, res, next) {
    Tag.count({}, (err, count) => {
      Tag.find({})
        .populate('dvds')
        .sort({updatedAt: -1})
        .skip((parseInt(req.query.page) - 1) * 30)
        .limit(30)
        .then((tags) => {
          res.render('tag_index', {tags, currentPage: parseInt(req.query.page) || 1, maxPages: Math.ceil(count / 30)});
        });
    })
  }
}
