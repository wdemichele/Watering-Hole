const { Int32, Timestamp } = require('mongodb');
const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

// user
let barSchema = new schema({
    name: { type: String },
    id: { type: String },
})

// user
let userSchema = new schema({
    username: { type: String, require: true },
    password: { type: String },
    favourites: [barSchema],
    bucketlist: [{ type: String }],
    recent_bars: [{ type: String }],
    recent_events: [{ type: String }],
    friends: [{ type: String }]
})

let user = mongoose.model('user', userSchema, 'user');


let mySchemas = { 'user': user };
module.exports = mySchemas;