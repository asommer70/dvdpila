const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: String,
  dvds: [{
    type: Schema.Types.ObjectId,
    ref: 'dvd'
  }]
});

const Tag = mongoose.model('tag', TagSchema);
module.exports = Tag;
