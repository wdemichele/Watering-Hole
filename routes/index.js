const express = require('express');
const router = express.Router();
const searchRouter = require('./searchRouter');
const eventRouter = require('./eventRouter');
const bodyParser = require("body-parser");
const axios = require('axios');
const schemas = require('../models/userSchema');
router.use('/search', searchRouter);
router.use('/event', eventRouter);

router.get('/', (_req, res) => {

    res.render('home.hbs', { layout: 'user-layout', title: 'User Results' });
});

router.get('/friends', async(req, res) => {
    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('friend-activity.hbs', { layout: 'user-layout', title: 'Friend Activity', user: user });
});

router.get('/about-us', (_req, res) => {

    res.render('about-page.hbs', { layout: 'guest-layout', title: 'About Us' });
});
router.get('/map', (_req, res) => {

    res.render('map-page.hbs', { layout: 'guest-layout', title: 'Map' });
});
router.get('/search', (_req, res) => {

    res.render('search-page.hbs', { layout: 'guest-layout', title: 'Search' });
});

router.get('/manual', (_req, res) => {

    res.render('user-manual.hbs', { layout: 'guest-layout', title: 'User Manual' });
});

router.get('/settings', async(_req, res) => {
    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();
    res.render('settings.hbs', { layout: 'user-layout', title: 'User Settings', user: user });
});

router.get('/login', (_req, res) => {

    res.render('login.hbs', { layout: 'guest-layout', title: 'User Login' });
});

router.get('/user', async(_req, res) => {

    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/tags', async(req, res) => {
    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();
    res.render('tags.hbs', { layout: 'user-layout', title: 'My Tags', user: user });
});

router.post('/tags', async(req, res) => {
    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOneAndUpdate({ username: username }, {
        $push: { tags: { tag: req.body.tag_name, bars: [] } }
    }).lean().exec();

    res.redirect('/user');
});

module.exports = router;