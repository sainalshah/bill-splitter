var mongoose = require('mongoose');

module.exports = mongoose.model('Config', {
    id: String,
    key: String,
    value: String,
    type:String
});
