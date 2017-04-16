const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BookmarkSchema = require('./bookmark_schema');


const EpisodeSchema = new Schema({
  name: { type: String, required: [true, 'Name is required.'] },
  fileUrl: String,
  playbackTime: Number,
  bookmarks: [BookmarkSchema]
}, { timestamps: true });

module.exports = EpisodeSchema;
