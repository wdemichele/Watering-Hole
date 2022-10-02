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

    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });

    let newUserSaved = await newUser.save();
    let user = await User.findOne({ username: req.body.username }).lean().exec();

    res.render('login.hbs', { layout: 'user-layout', title: 'User Login', user: user });

});

router.get('/', isLoggedIn, async(req, res) => {

    let username = req.user.username;
    let user = await User.findOne({ username: username }).lean().exec();

    res.render('user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/uid:id', isLoggedIn, async(req, res) => {

    let username = req.params.id;
    let user = await User.findOne({ username: username }).lean().exec();

    res.render('user/user-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });
});

router.get('/add-friends', isLoggedIn, async(req, res) => {
    console.log("here")

    let username = req.user.username;
    let user = await User.findOne({ username: username }).lean().exec();

    res.render('user/add-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.post('/add-friend', isLoggedIn, async(req, res) => {
    let response;

    let username = req.body.friend;
    if (!username) {
        username = "-1";
    }
    let friend = await User.findOne({ username: username }).lean().exec();

    if (friend) {
        let username = req.user.username;
        let user = await User.findOneAndUpdate({ username: username }, {
            $push: { friends: req.body.friend }
        }).lean().exec();
        response = "User Added to Friend List"
    } else {
        response = "User not found!"
    }

    res.render('user/add-friends.hbs', { layout: 'user-layout', title: 'User Results', response: response });

});


module.exports = router;