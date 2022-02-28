const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

module.exports = mongoose.model('Schedule', scheduleSchema);