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

        res.render('guest/login.hbs', { layout: 'guest-layout', title: 'User Login', flash: ["Account created, please login."] });
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

    res.render('user/user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user, mine: true, recently_visited: recently_visited });

});

router.get('/uid:id', isLoggedIn, async(req, res) => {
    let mine = false;
    let username = req.params.id;
    let user = await User.findOne({ username: username }).lean().exec();

    let me = user.pic

    if (username == req.user.username) {
        mine = true
    } else {
        me = await User.findOne({ username: req.user.username }, { pic: 1 }).lean().exec();
        me = me.pic
    }



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

    let personal = await User.findOne({ username: req.user.username }, { friends: 1 }).lean().exec();
    let friend = false
    if (personal.friends.includes(username)) {
        friend = true
    }

    res.render('user/user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user, mine: mine, recently_visited: recently_visited, friend: friend, pic: me });
});

router.get('/uid:id/friends', isLoggedIn, async(req, res) => {
    let username = req.params.id;
    let user = await User.findOne({ username: username }).lean().exec();

    let friends = await User.find({ username: { $in: user.friends } }, { "username": 1, "name": 1, "pic": 1 }).lean().exec()

    let me = user.pic
    if (username != req.user.username) {
        me = await User.findOne({ username: req.user.username }, { pic: 1 }).lean().exec();
        me = me.pic
    }
    res.render('user/user-friends.hbs', { layout: 'user-layout', title: 'User Friends', user: user, friends: friends, pic: me });
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

    let me = user.pic
    if (username != req.user.username) {
        me = await User.findOne({ username: req.user.username }, { pic: 1 }).lean().exec();
        me = me.pic
    }

    res.render('user/user-favourites.hbs', { layout: 'user-layout', title: 'User Favourites', user: user, favourites: favs, bucketlist: buck, pic: me });
});

router.get("/uid:id/pic", isLoggedIn, async(req, res) => {
    let username = req.params.id;
    let user = await User.findOne({ username: username }).lean().exec();

    let total = 91;
    let row_size = 7;

    let num_pics = [];
    let col = [];
    for (let i = 0; i < total; i++) {
        col.push(i)
        if (i % row_size == row_size - 1 || i == total - 1) {
            num_pics.push(col);
            col = []
        }
    }

    let me = user.pic
    if (username != req.user.username) {
        me = await User.findOne({ username: req.user.username }, { pic: 1 }).lean().exec();
        me = me.pic
    }

    res.render('user/user-pic.hbs', { layout: 'user-layout', title: 'My Tags', user: user, num_pics: num_pics, pic: me });
})

router.post("/uid:id/pic", isLoggedIn, async(req, res) => {
    let username = req.params.id;
    let index = req.body.pic_index;
    if (index >= 0) {
        let user = await User.findOneAndUpdate({ username: username }, { pic: index.toString() }).lean().exec();
    }

    res.redirect("/settings");
})


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

    let me = user.pic
    if (username != req.user.username) {
        me = await User.findOne({ username: req.user.username }, { pic: 1 }).lean().exec();
        me = me.pic
    }

    res.render('user/user-tag.hbs', { layout: 'user-layout', title: 'My Tags', user: user, selected: req.params.tag, tags: tags, pic: me });
});

router.get('/add-friends', isLoggedIn, async(req, res) => {

    let username = req.user.username;
    let user = await User.findOne({ username: username }).lean().exec();

    let me = user.pic
    if (username != req.user.username) {
        me = await User.findOne({ username: req.user.username }, { pic: 1 }).lean().exec();
        me = me.pic
    }

    res.render('user/add-friends.hbs', { layout: 'user-layout', title: 'User Results', user: user, pic: me });

});

router.post('/remove-friend/uid:id', isLoggedIn, async(req, res) => {
    let remove = await User.findOneAndUpdate({ username: req.user.username }, { $pull: { 'friends': req.params.id } });

    res.redirect('/user/uid' + req.params.id);
})

router.post('/add-friend/uid:id', isLoggedIn, async(req, res) => {

    let username = req.params.id;
    if (!username) {
        username = "-1";
    }
    let friend = await User.findOne({ username: username }).lean().exec();
    let user;
    if (friend) {
        let username = req.user.username;
        user = await User.findOneAndUpdate({ username: username }, {
            $push: { friends: req.params.id }
        }).lean().exec();
    }
    res.redirect('/user/uid' + username);
});

router.post('/search-friend', isLoggedIn, async(req, res) => {
    let response;

    let username = req.body.friend;
    if (!username) {
        username = "-1";
    }
    let friend = await User.findOne({ username: username }).lean().exec();
    let user;
    if (friend) {
        res.redirect('/user/uid' + username)
    } else {
        response = "User not found!"
        res.redirect('/social')
    }
});

router.post('/password-reset', isLoggedIn, async(req, res) => {


    bcrypt.hash(req.body.newPassword, saltRounds, async(err, hash) => {
        let updatedUser = await User.findOneAndUpdate({ username: req.user.username }, { password: hash }).lean().exec();
        res.redirect('/settings');
    });


});


module.exports = router;