const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  data: {
    inquiry: [{
      inquiryId: {
        type: Schema.Types.ObjectId,
        ref: 'Inquiry',
        required: true
      }
    }],
    schedule: [{
      scheduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true
      }
    }],
    vote: [{
      voteDataId: {
        type: Schema.Types.ObjectId,
        ref: 'Vote',
        required: true
      },
      selectedVote: {
        type: Number,
        required: true
      },
      date: {
        type: String,
        required: true
      }
    }]
  }
});

userSchema.methods.addInquiry = function (inquiry) {

  const updatedInquiries = [...this.data.inquiry];

  updatedInquiries.push({
    inquiryId: inquiry._id
  })

  this.data.inquiry = updatedInquiries
  return this.save();
}

userSchema.methods.addSchedule = function (schedule) {

  const updatedSchedules = [...this.data.schedule];

  updatedSchedules.push({
    scheduleId: schedule._id
  })

  this.data.schedule = updatedSchedules
  return this.save();
}


userSchema.methods.addVote = function (vote, selectedVote, date) {
  const updatedVotes = [...this.data.vote];
  console.log('this is the updated votes');

  updatedVotes.push({
    voteDataId: vote._id,
    selectedVote,
    date,
  })

  this.data.vote = updatedVotes;
  return this.save();
}




userSchema.methods.removeInquiry = function (inquiryId) {

  const updatedInquiry = this.data.inquiry.filter(inquiry => {
    return inquiry.inquiryId.toString() !== inquiryId.toString();
  })
  this.data.inquiry = updatedInquiry;
  return this.save();

}

userSchema.methods.removeSchedule = function (scheduleId) {

  const updatedSchedule = this.data.schedule.filter(schedule => {
    return schedule.scheduleId.toString() !== scheduleId.toString();
  })
  this.data.schedule = updatedSchedule;
  return this.save();

}
module.exports = mongoose.model('User', userSchema);