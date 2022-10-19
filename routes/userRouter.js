const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios');
const User = require('../models/userSchema');
const Bar = require('../models/barSchema');
const bcrypt = require('bcryptjs')
const saltRounds = 10

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

    res.render('user/create-user.hbs', { layout: 'guest-layout', title: 'Create User' });
});

router.post('/create', async(req, res) => {
    bcrypt.hash(req.body.password, saltRounds, async(err, hash) => {

        let newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hash
        });

        let newUserSaved = await newUser.save();

        res.render('guest/login.hbs', { layout: 'user-layout', title: 'User Login', flash: ["Account created, please login."] });
    });
});

router.post('/update:id', async(req, res) => {
    let username = req.params.id;
    let user = await User.findOne({ username: username }).lean().exec();
    let name = req.body.name
    let bio = req.body.bio
    if (!name) {
        if (user.name) {
            name = user.name;
        }
    }
    if (!bio) {
        if (user.bio) {
            bio = user.bio;
        }
    }
    let user_updated = await User.findOneAndUpdate({ username: req.params.id }, { name: name, bio: bio })
    res.redirect('/settings');
})

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

    let favourites = [];
    let bucketlist = [];

    for (let bar of user.bars) {
        if (bar.favourite) {
            favourites.push(bar.id);
        }
        if (bar.bucketlist) {
            bucketlist.push(bar.id);
        }
    }

    let favs = await Bar.find({ id: { $in: favourites } }).lean().exec();
    let buck = await Bar.find({ id: { $in: bucketlist } }).lean().exec();

    res.render('user/user-favourites.hbs', { layout: 'user-layout', title: 'User Favourites', user: user, favourites: favs, bucketlist: buck });
});

router.get('/uid:id/tags:tag', isLoggedIn, async(req, res) => {

    let username = req.params.id;
    let user = await User.findOne({ username: username }).lean().exec();

    let tags = {};
    for (let tag of user.tags) {
        tags[tag] = [];
    }

    for (let bar of user.bars) {
        for (let tag of bar.tags) {
            if (!tags[tag]) {
                tags[tag] = []
            }
            tags[tag].push(bar.id)
        }
    }

    for (let tag in tags) {
        tags[tag] = await Bar.find({ id: { $in: tags[tag] } }).lean().exec();
    }

    res.render('user/user-tag.hbs', { layout: 'user-layout', title: 'My Tags', user: user, selected: req.params.tag, tags: tags });
});

router.get('/add-friends', isLoggedIn, async(req, res) => {

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