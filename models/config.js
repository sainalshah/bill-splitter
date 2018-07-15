var mongoose = require('mongoose');

module.exports = mongoose.model('Config',{
    id: String,
    name: String,
    value: String,
    type: String
});
