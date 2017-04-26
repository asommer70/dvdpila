const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: { type: String, required: [true, 'Name is required.'] },
}, { timestamps: true });

module.exports = TagSchema;
