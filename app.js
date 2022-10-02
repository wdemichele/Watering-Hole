const express = require('express');
const path = require('path');
const router = require('./routes');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const axios = require("axios");
const session = require('express-session')
const passport = require("passport")
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./src/config')
const schemas = require('./models/userSchema');

require('dotenv/config');

const moment = require('moment');
const { stringify } = require('query-string');
const cookieParser = require('cookie-parser'); // for showing login error messages

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
            return true;
        }
    }
    return false;
});

// Comparison handled by handlebars
hbs.handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
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

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {

    return done(null, id)
})

// make our facebook strategy

passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL
}, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

app.use(cookieParser('secret'));

// express session middleware
app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || '4325d67fgih8o',
        name: 'sid', // The cookie name 
        saveUninitialized: false,
        resave: false,
        proxy: process.env.NODE_ENV === 'production', //  to work on Heroku
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 // sessions expire after 5 minutes
        },
    })
)


// passport
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const { doesNotMatch } = require('assert');
const flash = require('express-flash');

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

let User = schemas.user;

let strategy = new LocalStrategy((username, password, cb) => {
    // first, check if there is a user in the db with this username
    User.findOne({ username: username }, {}, {}, (err, user) => {
        if (err) { return cb(null, false) }
        if (!user) { return cb(null, false, { message: 'Incorrect login credentials.' }) }
        const hash = user.password;

        bcrypt.compare(password, hash, function(err, response) {
            if (response === true) {
                return cb(null, user);
            } else {
                return cb(null, false, { message: 'Incorrect login credentials.' })
            }
        });
    });
})

passport.use(strategy);

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