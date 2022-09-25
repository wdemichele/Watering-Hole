const { Int32, Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;


// defaut date
let today = new Date();

let location = new schema({
    lat: { type: String },
    long: { type: String }
})

let open_hours = new schema({
    close: { day: { type: Number }, time: { type: String } },
    open: { day: { type: Number }, time: { type: String } }
})

// bar
let barSchema = new schema({
    name: { type: String },
    id: { type: String },
    address: { type: String },
    price_level: { type: Number },
    rating: { type: Number },
    hours: [open_hours],
    location: location
})

let activitySchema = new schema({
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