const { Int32, Timestamp } = require('mongodb');
const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;


// defaut date
let today = new Date();

// user
let barSchema = new schema({
    name: { type: String },
    id: { type: String },
    address: { type: String }
})

let eventSchema = new schema({
    name: { type: String },
    id: { type: String },
})

let activitySchema = new schema({
    name: { type: String },
    id: { type: String },
    address: { type: String },
    time: { type: Date, default: today },
    type: { type: String }
})

// user
let userSchema = new schema({
    username: { type: String, require: true },
    name: { type: String },
    password: { type: String },
    favourites: [barSchema],
    bucketlist: [barSchema],
    recent_bars: [barSchema],
    recent_events: [eventSchema],
    friends: [{ type: String }],
    recent_activity: [activitySchema]
})

let user = mongoose.model('user', userSchema, 'user');


let mySchemas = { 'user': user };
module.exports = mySchemas;