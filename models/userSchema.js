const mongoose = require('mongoose');
const schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;
// var passportLocalMongoose = require('passport-local-mongoose');

// defaut date
let today = new Date();

let activitySchema = new schema({
    id: { type: String },
    type: { type: String }, // ENUM{"favourited, bucketlisted, visited"}
    name: { type: String },
    address: { type: String },
    time: { type: Date, default: today }
})

// user
let userSchema = new schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    pic: { type: String },
    name: { type: String },
    bars: [{
        id: { type: String },
        favourite: { type: Boolean },
        bucketlist: { type: Boolean },
        tags: [{ type: String }]
    }],
    activity: [activitySchema],
    friends: [{ type: String }],
    tags: [{ type: String }]
})

module.exports = mongoose.model('user', userSchema, 'user');