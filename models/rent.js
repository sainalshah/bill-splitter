var mongoose = require('mongoose');

module.exports = mongoose.model('Rent', {
    id: String,
    billStartDate: { type: Date, default: null},
    billEndDate: { type: Date, default: null },
    rent: [{
        _id: String,
        rent: Number
    }],
    createdTstamp: { type: Date, default: Date.now }
});
