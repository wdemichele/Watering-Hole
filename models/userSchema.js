const { Int32, Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;


// defaut date
let today = new Date();

// bar
let barSchema = new schema({
    name: { type: String },
    id: { type: String },
    address: { type: String }
})

let activitySchema = new schema({
    name: { type: String },
    id: { type: String },
    address: { type: String },
    time: { type: Date, default: today },
    type: { type: String }
})

let tag = new schema({
    tag: { type: String },
    bars: [barSchema]
})

// user
let userSchema = new schema({
    username: { type: String, require: true },
    pic: { type: String },
    name: { type: String },
    password: { type: String },
    favourites: [barSchema],
    bucketlist: [barSchema],
    recent_bars: [barSchema],
    friends: [{ type: String }],
    recent_activity: [activitySchema],
    tags: [tag]
})

let user = mongoose.model('user', userSchema, 'user');

let mySchemas = { 'user': user };
module.exports = mySchemas;