const express = require('express');
const path = require('path');
const router = require('./routes');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const axios = require("axios");

const DB_URI = "mongodb+srv://the-leftovers:OEIiTEbBpuJCluKH@personal-items-register.ll54ewt.mongodb.net/bar-collection?retryWrites=true&w=majority";

// Set up app
const app = express()

// handlebars properties
app.engine('hbs', exphbs.engine({
    layoutsDir: './views/layouts',
    partialsDir: './views/partials',
    extname: 'hbs'
}));

// helpers
const hbs = exphbs.create({});

hbs.handlebars.registerHelper("array_length", function(array) {
    return array.length;
});

app.set('view engine', 'hbs');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.use(router);

app.listen(app.get('port'), () => { console.log('App is listening on port ' + app.get('port')) });

// // DB connection
// mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('Connected to DB');
//     })
//     .catch((err) => {
//         console.log(err);
//     });