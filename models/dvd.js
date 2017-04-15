const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DvdSchema = new Schema({
  title: { type: String, required: [true, 'Title is required.'] },
  rating: Number,
  abstractTxt: String,
  abstractSource: String,
  abstractUrl: String,
  imageUrl: String,
  fileUrl: String,
  playbackTime: Number
},
{
  timestamps: true
});

const Dvd = mongoose.model('dvd', DvdSchema);
module.exports = Dvd;
