const mongoose = require('mongoose');
const EpisodeSchema = require('./episode_schema');
const BookmarkSchema = require('./bookmark_schema');
const Schema = mongoose.Schema;

const DvdSchema = new Schema({
  title: { type: String, required: [true, 'Title is required.'], index: true, text: true },
  rating: Number,
  abstractTxt: String,
  abstractSource: String,
  abstractUrl: String,
  imageUrl: String,
  fileUrl: String,
  playbackTime: Number,
  episodes: [EpisodeSchema],
  bookmarks: [BookmarkSchema],
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'tag'
  }]
},
{
  timestamps: true
});

const Dvd = mongoose.model('dvd', DvdSchema);
module.exports = Dvd;
