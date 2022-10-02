const express = require('express');
const router = express.Router();
const searchRouter = require('./searchRouter');
const userRouter = require('./userRouter');
const bodyParser = require("body-parser");
const axios = require('axios');
const schemas = require('../models/userSchema');
const passport = require('passport');
const bcrypt = require('bcrypt');

router.use('/search', searchRouter);
router.use('/user', userRouter);

router.get('/home', isLoggedIn, async(req, res) => {
    console.log(req.user);
    let username = req.user.id;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();
    if (!user) {
        // now new user
        let newUser = new users({
            username: username,
            pic: { type: String },
            name: req.user.displayName,
            password: { type: String },
            favourites: [barSchema],
            bucketlist: [barSchema],
            recent_bars: [barSchema],
            friends: [{ type: String }],
            recent_activity: [activitySchema],
            tags: [tag]
        });

        newUserSaved = await newUser.save();
    }
    res.render('home.hbs', { layout: 'user-layout', title: 'User Results', user: req.user });
});

router.get('/friends', isLoggedIn, async(req, res) => {
    let username = req.user.externalId;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('friend-activity.hbs', { layout: 'user-layout', title: 'Friend Activity', user: user });
});

router.get('/about-us', (_req, res) => {

    res.render('about-page.hbs', { layout: 'guest-layout', title: 'About Us' });
});
router.get('/maps', (_req, res) => {

    res.render('map-page.hbs', { layout: 'guest-layout', title: 'map' });
});

router.get('/manual', (_req, res) => {

    res.render('user-manual.hbs', { layout: 'guest-layout', title: 'User Manual' });
});

router.get('/settings', isLoggedIn, async(_req, res) => {
    let username = req.user.externalId;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();
    res.render('settings.hbs', { layout: 'user-layout', title: 'User Settings', user: user });
});

router.get('/', (_req, res) => {

    res.render('login.hbs', { layout: 'guest-layout', title: 'User Login' });
});

// USER LOGIN
router.get('/login', async(req, res) => {

    res.render('home.hbs', {
        flash: req.flash('error'),
        layout: 'user-layout',
        title: 'Home'
    });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/login',
        failureRedirect: '/',
        failureFlash: true
    })
);

router.get('/user', isLoggedIn, async(_req, res) => {

    let username = req.user.externalId;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/friend:id', isLoggedIn, async(req, res) => {

    let username = req.params.id;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('friend-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/user:id/friends', isLoggedIn, async(req, res) => {

    let username = req.params.id;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/add-friends', isLoggedIn, async(req, res) => {

    let username = req.user.externalId;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('add-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/tags', isLoggedIn, async(req, res) => {
    let username = req.user.externalId;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();
    res.render('tags.hbs', { layout: 'user-layout', title: 'My Tags', user: user });
});

router.post('/tags', isLoggedIn, async(req, res) => {
    let username = req.user.externalId;
    let users = schemas.user;
    let user = await users.findOneAndUpdate({ username: username }, {
        $push: { tags: req.body.tag_name }
    }).lean().exec();

    res.redirect('/user');
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get("/facebook/callback", passport.authenticate('facebook', {
    successRedirect: '/home',
    failureRedirect: '/'
}))

router.get('/error', isLoggedIn, function(req, res) {
    res.render('pages/error.hbs');
});

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email', 'picture.type(large)']
}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/home',
        failureRedirect: '/error'
    }));

router.get('/logout', isLoggedIn, function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = router;