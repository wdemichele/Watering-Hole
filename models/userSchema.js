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
    address: { type: String },
    price: { type: String },
    location: { type: String },
    time: { type: String }
})

// user
let userSchema = new schema({
    username: { type: String, require: true },
    name: { type: String },
    password: { type: String },
    bars: [{
        bar: { type: String },
        favourite: { type: Boolean },
        bucketlist: { type: Boolean },
        tags: [{ type: String }]
    }],
    visited: [{ type: String }],
    friends: [{ type: String }],
    tags: [{ type: String }]
})

let user = mongoose.model('user', userSchema, 'user');
let bar = mongoose.model('bar', barSchema, 'bar');

let mySchemas = { 'user': user, 'bar': bar };
module.exports = mySchemas;