const express = require('express');
const router = express.Router();
const searchRouter = require('./searchRouter');
const bodyParser = require("body-parser");
const axios = require('axios');
const userSchema = require('../models/userSchema');

const USERNAME = "joe-smith"

router.use('/search', searchRouter);

router.get('/home', (_req, res) => {

    res.render('home.hbs', { layout: 'user-layout', title: 'User Results' });
});

router.get('/friends', async(req, res) => {
    let username = USERNAME;
    let users = userSchema.user;
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

router.get('/settings', async(_req, res) => {
    let username = USERNAME;
    let users = userSchema.user;
    let user = await users.findOne({ username: username }).lean().exec();
    res.render('settings.hbs', { layout: 'user-layout', title: 'User Settings', user: user });
});

router.get('/', (_req, res) => {

    res.render('login.hbs', { layout: 'guest-layout', title: 'User Login' });
});

router.get('/user', async(_req, res) => {

    let username = USERNAME;
    let users = userSchema.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/friend:id', async(req, res) => {

    let username = req.params.id;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('friend-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/user:id/friends', async(req, res) => {

    let username = req.params.id;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/add-friends', async(req, res) => {

    let username = USERNAME;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('add-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/tags', async(req, res) => {
    let username = USERNAME;
    let users = userSchema.user;
    let user = await users.findOne({ username: username }).lean().exec();
    res.render('tags.hbs', { layout: 'user-layout', title: 'My Tags', user: user });
});

router.post('/tags', async(req, res) => {
    let username = USERNAME;
    let users = userSchema.user;
    let user = await users.findOneAndUpdate({ username: username }, {
        $push: { tags: req.body.tag_name }
    }).lean().exec();

    res.redirect('/user');
});

module.exports = router;