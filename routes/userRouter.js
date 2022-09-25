const { response } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios');
const schemas = require('../models/userSchema');
const { Db } = require('mongodb');
const { default: mongoose } = require('mongoose');
const mongodb = require('mongodb');

let USERNAME = "jane-smith"

router.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json());


router.get('/', async(req, res) => {
    let username = ""
    if (req.params.id) {
        username = req.params.id;
    } else {
        username = USERNAME;
    }
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user/user-profile.hbs', { layout: 'user-layout', title: 'User Profile', user: user });

});

router.get('/friends', async(req, res) => {

    let username = req.params.id;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user/user-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/favourites', async(req, res) => {

    let username = req.params.id;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user/user-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/bucketlist', async(req, res) => {

    let username = req.params.id;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user/user-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});

router.get('/tag:tag', async(req, res) => {

    let username = req.params.id;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('user/user-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user });

});


module.exports = router;