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

router.get('/settings', async(_req, res) => {
    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();
    res.render('settings.hbs', { layout: 'user-layout', title: 'User Settings', user: user });
});

router.get('/log-out', (_req, res) => {

    res.render('login.hbs', { layout: 'user-layout', title: 'User Login' });
});

router.get('/user', async(_req, res) => {

    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

module.exports = router;