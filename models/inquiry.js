const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inquirySchema = new Schema({
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status:{
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Inquiry', inquirySchema);