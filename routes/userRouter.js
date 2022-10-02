const express = require('express');
const router = express.Router();
const searchRouter = require('./searchRouter');
const bodyParser = require("body-parser");
const axios = require('axios');
const schemas = require('../models/userSchema');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const saltRounds = 69;

router.get('/create', async(req, res) => {

    res.render('user/create-user.hbs', { layout: 'user-layout', title: 'Create User' });
});

router.post('/create', async(req, res) => {

    // bcrypt.hash(req.body.password, saltRounds, async(err, hash) => {
    // });
    let User = schemas.user;

    // now new user
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });

    let newUserSaved = await newUser.save();

    let user = await User.findOne({ username: req.body.username }).lean().exec();

    res.render('login.hbs', { layout: 'user-layout', title: 'User Login', user: user });

});

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

module.exports = router;