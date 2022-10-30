const express = require('express');
const router = express.Router();
const searchRouter = require('./searchRouter');
const userRouter = require('./userRouter');
const bodyParser = require("body-parser");
const axios = require('axios');
const User = require('../models/userSchema');
const Bar = require('../models/barSchema');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const res = require('express/lib/response');

router.use(bodyParser.urlencoded({ extended: true }));
router.use('/search', searchRouter);
router.use('/user', userRouter);

// Passport Authentication middleware
const isLoggedIn = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

router.get('/home', isLoggedIn, async(req, res) => {
    let username = req.user.username;
    let user = await User.findOne({ username: username }).lean().exec();

    let recently_visited = [];
    for (let i = user.activity.length - 1; i >= 0; i--) {
        if (recently_visited.length < 4 && user.activity[i].type == "visited") {
            recently_visited.push(user.activity[i].id);
        }
        if (recently_visited.length >= 4) {
            break;
        }
    }
    recently_visited = await Bar.find({ id: { $in: recently_visited } }).lean().exec();

    let recently_favourited = [];
    let recently_bucketlisted = [];
    for (let i = user.bars.length - 1; i >= 0; i--) {
        if (recently_favourited.length < 4 && user.bars[i].favourite) {
            recently_favourited.push(user.bars[i].id);
        }
        if (recently_bucketlisted.length < 4 && user.bars[i].bucketlist) {
            recently_bucketlisted.push(user.bars[i].id);
        }
        if (recently_favourited.length >= 4 && recently_bucketlisted.length >= 4) {
            break;
        }
    }

    recently_favourited = await Bar.find({ id: { $in: recently_favourited } }).lean().exec();
    recently_bucketlisted = await Bar.find({ id: { $in: recently_bucketlisted } }).lean().exec();

    let friend_activity = await User.find({ username: { $in: user.friends } }, { username: 1, name: 1, pic: 1, activity: { $slice: -1 } }).lean().exec();

    let popular_with_friends = [];
    for (let friend of friend_activity) {
        if (friend.activity[0] && friend.activity[0].id && !popular_with_friends.includes(friend.activity[0].id)) {

            popular_with_friends.push(friend.activity[0].id);
        }
        if (popular_with_friends.length >= 4) {
            break;
        }
    }
    console.log(popular_with_friends)
    popular_with_friends = await Bar.find({ id: { $in: popular_with_friends } }).lean().exec();
    console.log(popular_with_friends)
        // console.log(popular_with_friends)


    res.render('home.hbs', {
        layout: 'user-layout',
        title: 'My Watering Hole',
        user: user,
        recently_visited: recently_visited,
        popular_with_friends: popular_with_friends,
        recently_favourited: recently_favourited,
        recently_bucketlisted: recently_bucketlisted,
        friend_activity: friend_activity
    });
});

router.get('/social', isLoggedIn, async(req, res) => {
    let username = req.user.username;
    let user = await User.findOne({ username: username }).lean().exec();

    let activity = await User.find({ username: user.friends }, { activity: 1, name: 1, username: 1, '_id': false }).lean().exec();

    res.render('friend-activity.hbs', { layout: 'user-layout', title: 'Friend Activity', user: user, activity: activity });
});

router.get('/about-us', (req, res) => {

    res.render('guest/about-page.hbs', { layout: 'guest-layout', title: 'About Us' });
});

router.get('/manual', (req, res) => {

    res.render('guest/user-manual.hbs', { layout: 'guest-layout', title: 'User Manual' });
});

router.get('/contact', (req, res) => {
    res.render('guest/contact-us.hbs', { layout: 'guest-layout', title: 'Contact' });
});

router.get('/settings', isLoggedIn, async(req, res) => {
    let username = req.user.username;
    let user = await User.findOne({ username: username }).lean().exec();
    res.render('settings.hbs', { layout: 'user-layout', title: 'User Settings', user: user });
});

router.get('/', (req, res) => {

    res.render('guest/login.hbs', { layout: 'guest-layout', title: 'Watering Hole', flash: req.flash('error') });
});

router.get('/map', async(req, res) => {
    let username = "maps";
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

    let tourStopsFav = [];

    for (let fav of favs) {
        tourStopsFav.push({
            "position": {
                "lat": fav.location.lat,
                "lng": fav.location.long
            },
            "title": "<a href='/search/bar" + fav.id + "'><h3>" + fav.name + "</h3>" + "<em>" + fav.address + "<em></a>"
        })
    }

    console.log(tourStopsFav)
    let stringTourStopsFav = JSON.stringify(tourStopsFav);
    console.log(stringTourStopsFav)
    res.render('map.hbs', { layout: 'guest-layout', title: 'Map', stringTourStopsFav: stringTourStopsFav });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
);

router.post('/tags', isLoggedIn, async(req, res) => {
    let username = req.user.username;
    let user = await User.findOneAndUpdate({ username: username }, {
        $push: { tags: req.body.tag_name }
    }).lean().exec();

    res.redirect('/user');
});

router.get('/error', isLoggedIn, function(req, res) {
    res.render('error.hbs');
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.logout();
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.clearCookie('session-id');
                res.json({
                    message: 'You are successfully logged out!'
                });
            }
        });
    } else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});

module.exports = router;