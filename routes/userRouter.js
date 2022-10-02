const express = require('express');
const router = express.Router();
const searchRouter = require('./searchRouter');
const bodyParser = require("body-parser");
const axios = require('axios');
const User = require('../models/userSchema');
const Bar = require('../models/barSchema');
var passport = require('passport');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

router.use(bodyParser.json());

const isLoggedIn = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

router.get('/create', async(req, res) => {

    res.render('user/create-user.hbs', { layout: 'user-layout', title: 'Create User' });
});

router.post('/create', async(req, res) => {

    // bcrypt.hash(req.body.password, saltRounds, async(err, hash) => {

    // now new user
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });

    let newUserSaved = await newUser.save();

    let user = await User.findOne({ username: req.body.username }).lean().exec();
    // });


    res.render('login.hbs', { layout: 'user-layout', title: 'User Login', user: user });

});

router.get('/', isLoggedIn, async(req, res) => {

    let username = req.user.username;
    let user = await User.findOne({ username: username }).lean().exec();

    res.render('user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/:id', isLoggedIn, async(req, res) => {

    let username = req.params.id;
    let user = await User.findOne({ username: username }).lean().exec();

    res.render('user-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});


module.exports = router;