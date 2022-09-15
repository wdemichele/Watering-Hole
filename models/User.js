const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    uid: String,
    email: String,
    name: String,
    pic: String
});

module.exports = mongoose.model('User', userSchema);