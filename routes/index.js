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
const saltRounds = 10;

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

    res.render('home.hbs', { layout: 'user-layout', title: 'User Results', user: user });
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

    res.render('guest/login.hbs', { layout: 'guest-layout', title: 'User Login', flash: req.flash('error') });
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