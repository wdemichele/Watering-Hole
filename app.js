require('dotenv').config()
const express = require('express');
const path = require('path');
const router = require('./routes');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const axios = require("axios");
const passport = require("passport")
const facebookStrategy = require('passport-facebook').Strategy
const session = require('express-session')


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

hbs.handlebars.registerHelper('reverseArray', (array) => array.reverse());

hbs.handlebars.registerHelper("array_length", function(array) {
    return array.length;
});

// limit an array to a maximum of elements (from the start)
hbs.handlebars.registerHelper('limit', function(arr, limit) {
    if (limit > arr.length) {
        limit = arr.length;
    }
    if (!Array.isArray(arr)) { return []; }
    return arr.slice(0, limit);
});

hbs.handlebars.registerHelper("contains", function(array, num) {
    if (!array) {
        return false;
    }
    for (let i = 0; i < array.length; i++) {
        if (array[0].id == num) {
            console.log("here");
            return true;
        }
    }
    return false;
});

app.set('view engine', 'hbs');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "thisismysupersecretkey"
}))

app.use(passport.initialize());
app.use(passport.session());



// make our facebook strategy

passport.use(new facebookStrategy({

        clientID: "575053360778510",
        clientSecret: "fb6cb29812b497f09a02ca0826328b5d",
        callbackURL: "https://my-watering-hole.herokuapp.com/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']
    },
    function(token, refreshToken, profile, done) {
        console.log(profile);
        return done(null, profile)
    }))

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get("facebook/callback", passport.authenticate('facebook', {
    successRedirect: '/home',
    failureRedirect: '/'
}))

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {

    return done(null, id)
})

app.use(router);

app.listen(app.get('port'), () => { console.log('App is listening on port ' + app.get('port')) });

// DB connection
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log(err);
    });