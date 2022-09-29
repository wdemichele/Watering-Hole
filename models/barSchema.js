const { Int32, Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

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
    hours: [{ type: String }],
    location: { type: String }
})

let bar = mongoose.model('bar', barSchema, 'bar');

let mySchemas = { 'bar': bar };
module.exports = mySchemas;