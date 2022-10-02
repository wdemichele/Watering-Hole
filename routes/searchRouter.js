const { response } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios');
const schemas = require('../models/userSchema');
const { Db } = require('mongodb');
const { default: mongoose } = require('mongoose');
const mongodb = require('mongodb');

const USERNAME = "joe-smith"

router.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json());

router.get('/bar-search', async(_req, res) => {

    res.render('search/bar-search.hbs', { layout: 'user-layout', title: 'Bar Search' });
});

router.post('/bar-search', async(req, res) => {

    let input = req.body.bar_name;
    input = input.replace(/ /gi, "%20")

    let config = {
        method: 'get',
        // url: 'https://maps.googleapis.com/maps/api/place/textSearch/json?query=' + input + '&fields=formatted_address%2Cplace_id%2Cname%2Crating%2Copening_hours%2Cgeometry%2cphotos&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + input + '&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        headers: {}
    };

    axios(config)
        .then(function(response) {
            console.log(response.data)
            res.render('search/bar-search-results.hbs', { layout: 'user-layout', title: 'Bar Search Results', places: response.data.results, search: req.body.bar_name, query: req.body.bar_name, page_token: response.data.next_page_token });

        })
        .catch(function(error) {
            console.log(error);
        });
});

router.post('/more-bars', async(req, res) => {

    let page_token = req.body.page_token;

    let config = {
        method: 'get',
        url: "https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=" + page_token + "&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw",
        headers: {}
    };

    axios(config)
        .then(function(response) {
            res.render('search/bar-search-results.hbs', { layout: 'user-layout', title: 'Bar Search Results', places: response.data.results, search: req.body.bar_name, query: req.body.bar_name, page_token: response.data.next_page_token });

        })
        .catch(function(error) {
            console.log(error);
        });
});

router.post('/area-search', async(req, res) => {

    let input = req.body.area_name;

    input = input.replace(/ /gi, "%20")

    let config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + input + '&inputtype=textquery&fields=geometry&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        headers: {}
    };

    axios(config)
        .then(function(response) {
            config = {
                method: 'get',
                url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + response.data.candidates[0].geometry.location.lat + '%2C' + response.data.candidates[0].geometry.location.lng + '&radius=' + req.body.area_radius + '&type=bar&fields=name%2Crating%2Cformatted_phone_number%2Cformatted_address%2Copening_hours%2Cprice_level%2Ctypes%2Cwebsite%2Cgeometry%2Cphotos&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
                headers: {}
            };
            axios(config)
                .then(function(response) {
                    res.render('search/bar-search-results.hbs', { layout: 'user-layout', title: 'Bar Search Results', places: response.data.results, search: req.body.area_name, query: "bars%20near" + input, page_token: response.data.next_page_token });

                })
                .catch(function(error) {
                    console.log(error);
                });
        })
        .catch(function(error) {
            console.log(error);
        });
});

router.get('/bar:id', async(req, res) => {
    let username = USERNAME;
    let users = schemas.user;
    let user = await users.findOne({
        username: username
    }).lean().exec();

    let bar_id = req.params.id;

    let config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + bar_id + '&fields=name%2Crating%2Cplace_id%2Cformatted_phone_number%2Cformatted_address%2Copening_hours%2Cprice_level%2Ctypes%2Cwebsite%2Cgeometry%2Cphotos&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        headers: {}
    };

    axios(config)
        .then(function(response) {
            // console.log(response.data)
            // console.log(response.data.result.opening_hours)
            // console.log(response.data.result.opening_hours.periods)
            // console.log(response.data.result.geometry.location)
            res.render('search/bar.hbs', { layout: 'user-layout', title: "Bar Details", place_data: response.data.result, bucketlisted: false, favourited: false, tags: user.tags });
        })
        .catch(function(error) {
            console.log(error);
        });
});

router.post('/bar:id/tags', async(req, res) => {
    let bars = schemas.bar
    let bar = await bars.findOne({ id: req.params.bar_id })

    if (!bar) {
        let newBar = new bars({
            name: req.body.bar_name,
            id: req.params.bar_id,
            address: req.body.bar_address,
            price_level: req.body.bar_price,
            rating: req.body.bar_rating
                // hours: req.body.bar_hours,
                // location: req.body.bar_location
        })
        let newBarSaved = await newBar.save();
    }

    let username = USERNAME;
    let users = schemas.user;

    let array = []
    let user = await users.findOne({
        username: username
    }).lean().exec();

    for (let tag of user.tags) {
        if (req.body[tag]) {
            let current_tag = await users.findOneAndUpdate({
                username: username,
                bars: { $elemMatch: { id: req.params.id } }
            }, { $addToSet: { "bars.$.tags": tag } }).lean().exec();
        }
    }

    res.redirect('/search/bar' + req.params.id);
});

router.post('/bar-favourite:bar_id', async(req, res) => {

    let bars = schemas.bar
    let bar = await bars.findOne({ id: req.params.bar_id })

    if (!bar) {
        let newBar = new bars({
            name: req.body.bar_name,
            id: req.params.bar_id,
            address: req.body.bar_address,
            price_level: req.body.bar_price,
            rating: req.body.bar_rating
                // hours: req.body.bar_hours,
                // location: req.body.bar_location
        })
        let newBarSaved = await newBar.save();
    }

    let username = USERNAME;
    let users = schemas.user;

    let fav = undefined;
    if (typeof req.body.favourite_button !== 'undefined') {
        fav = true
        let updatedUser = await users.findOneAndUpdate({ username: username }, {
            $push: {
                activity: {
                    id: req.params.bar_id,
                    name: req.body.bar_name,
                    address: req.body.bar_address,
                    type: "favourited"
                }
            }
        });
    } else if (typeof req.body.favourite_remove !== 'undefined') {
        fav = false
        let updatedUser = await user.findOneAndUpdate({ username: username }, { $pull: { "activity.id": req.params.bar_id, type: "favourited" } });
    }

    let buck = undefined;
    if (typeof req.body.bucketlist_button !== 'undefined') {
        buck = true
        let updatedUser = await users.findOneAndUpdate({ username: username }, {
            $push: {
                activity: {
                    id: req.params.bar_id,
                    name: req.body.bar_name,
                    address: req.body.bar_address,
                    type: "bucketlisted"
                }
            }
        });
    } else if (typeof req.body.bucketlist_remove !== 'undefined') {
        buck = false
        let updatedUser = await user.findOneAndUpdate({ username: username }, { $pull: { "activity.id": req.params.bar_id, type: "bucketlisted" } });
    }


    let user = await users.findOne({ username: username });

    let barEntry = undefined;
    let index = 0;
    for (let bar of user.bars) {
        if (bar.id == req.params.bar_id) {
            barEntry = bar
            break;
        }
        index += 1;
    }

    // create a new bar entry
    if (!barEntry) {
        if (typeof fav !== 'undefined') {
            barEntry = {
                id: req.params.bar_id,
                favourite: fav,
                bucketlist: false,
            }
        } else if (typeof buck !== 'undefined') {
            barEntry = {
                id: req.params.bar_id,
                favourite: fav,
                bucketlist: true,
            }
        }
        user.bars.push(barEntry)
        let updated = await user.save();
    }

    // edit existing bar entry
    else {
        if (typeof fav !== 'undefined') {
            user.bars[index].favourite = fav;
        } else if (typeof buck !== 'undefined') {
            user.bars[index].bucketlist = fav;
        }
        let updated = await user.save();
    }

    res.redirect('bar' + req.params.bar_id);

})

router.post('/bar-visit:bar_id', async(req, res) => {

    let username = USERNAME;
    let user = schemas.user;


    let updatedUser = await user.findOneAndUpdate({ username: username }, {
        $push: {
            activity: {
                id: req.params.bar_id,
                name: req.body.bar_name,
                address: req.body.bar_address,
                type: "visited"
            }
        }
    });

    res.redirect('bar' + req.params.bar_id);

})

router.get('/favourites-search', async(_req, res) => {
    let username = USERNAME;
    let users = schemas.user;

    let user = await users.findOne({
        username: username
    }).lean().exec();
    res.render('search/favourites-search.hbs', { layout: 'user-layout', title: 'Bar Favourites Search', user: user });
});

router.post('/favourites-search', async(req, res) => {
    let username = USERNAME;
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    let tags = []
    let favourites = []
    for (let tag of user.tags) {
        if (req.body[tag]) {
            tags.push(tag);
        }
    }
    console.log(tags)

    if (!tags.length) {
        favourites = user.favourites
    } else {
        for (let bar of user.bars) {
            let contains = bar.tags.some(element => {
                return tags.indexOf(element) !== -1;
            });
            if (contains) {
                favourites.push(bar.id)
            }
        }
    }
    console.log(favourites)

    let bars = schemas.bar;
    let favs = await bars.find({ id: { $in: favourites } }).lean().exec();
    console.log(favs)

    res.render('search/favourites-search-results.hbs', { layout: 'user-layout', title: "Bar Details", favourites: favs });
});

function getIntersection(a, b) {
    const set1 = new Set(a);
    const set2 = new Set(b);

    const intersection = [...set1].filter(
        element => set2.has(element)
    );

    return intersection;
}

module.exports = router;