var mongoose = require('mongoose');

module.exports = mongoose.model('Bill',{
    id: String,
    createdBy: String,
    createdTstamp: { type : Date, default: Date.now },
    amount: Number,
    type: String,
    payableUsers: [String],
    description: String,
    attachment: String
});
