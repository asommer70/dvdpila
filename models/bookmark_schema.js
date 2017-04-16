const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookmarkSchema = new Schema({
  name: { type: String, required: [true, 'Name is required.'] },
  time: Number,
}, { timestamps: true });

module.exports = BookmarkSchema;
