const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios');
const User = require('../models/userSchema');
const Bar = require('../models/barSchema');

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

    res.render('guest/login.hbs', { layout: 'user-layout', title: 'User Login', user: user, flash: ["Account created, please login."] });

});

router.get('/', isLoggedIn, async(req, res) => {

    let username = req.user.username;
    let user = await User.findOne({ username: username }).lean().exec();

    res.render('user/user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user, mine: true });

});

router.get('/uid:id', isLoggedIn, async(req, res) => {
    let mine = false;
    let username = req.params.id;
    if (username == req.user.username) {
        mine = true
    }
    let user = await User.findOne({ username: username }).lean().exec();

    res.render('user/user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user, mine: mine });
});

router.get('/uid:id/friends', isLoggedIn, async(req, res) => {
    let username = req.params.id;
    let user = await User.findOne({ username: username }).lean().exec();

    res.render('user/user-friends.hbs', { layout: 'user-layout', title: 'User Friends', user: user });
});

router.get('/uid:id/favourites', isLoggedIn, async(req, res) => {

    let username = req.params.id;
    let user = await User.findOne({ username: username }).lean().exec();

    res.render('user/user-favourites.hbs', { layout: 'user-layout', title: 'User Favourites', user: user });
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
    let user;
    if (friend) {
        let username = req.user.username;
        user = await User.findOneAndUpdate({ username: username }, {
            $push: { friends: req.body.friend }
        }).lean().exec();
        response = "User Added to Friend List"
    } else {
        response = "User not found!"
    }

    res.render('user/add-friends.hbs', { layout: 'user-layout', title: 'User Results', response: response, user: user });

});


module.exports = router;