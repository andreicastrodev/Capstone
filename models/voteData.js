const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const voteDataSchema = new Schema({

    votees: {
        type: [],
        required: true
    },
    voteCount: {
        type: [],
        required: true
    },
    voteId: {
        type: Schema.Types.ObjectId,
        ref: 'Vote',
        required: true
    },

});

module.exports = mongoose.model('VoteData', voteDataSchema);