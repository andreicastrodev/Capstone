const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const voteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  choices: {
    type: [],
    required: true
  },
 
});

module.exports = mongoose.model('Vote', voteSchema);