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

    let username = USERNAME;
    let users = schemas.user;
    let bucketlist = await users.find({
        username: username
    }, {
        bucketlist: { id: 1 }
    }).lean().exec();

    let favourites = await users.find({
        username: username
    }, {
        favourites: { id: 1 }
    }).lean().exec();

    let config = {
        method: 'get',
        // url: 'https://maps.googleapis.com/maps/api/place/textSearch/json?query=' + input + '&fields=formatted_address%2Cplace_id%2Cname%2Crating%2Copening_hours%2Cgeometry%2cphotos&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + input + '&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        headers: {}
    };

    axios(config)
        .then(function(response) {
            console.log(response.data)
            res.render('search/bar-search-results.hbs', { layout: 'user-layout', title: 'Bar Search Results', places: response.data.results, search: req.body.bar_name, query: req.body.bar_name, page_token: response.data.next_page_token, bucketlist: bucketlist[0].bucketlist, favourites: favourites[0].favourites });

        })
        .catch(function(error) {
            console.log(error);
        });
});

router.post('/more-bars', async(req, res) => {

    let page_token = req.body.page_token;
    let input = req.body.bar_name;

    let username = { type: String };
    let users = schemas.user;
    let bucketlist = await users.find({
        username: username
    }, {
        bucketlist: { id: 1 }
    }).lean().exec();

    let favourites = await users.find({
        username: username
    }, {
        favourites: { id: 1 }
    }).lean().exec();

    let config = {
        method: 'get',
        url: "https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=" + page_token + "&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw",
        headers: {}
    };

    axios(config)
        .then(function(response) {
            res.render('search/bar-search-results.hbs', { layout: 'user-layout', title: 'Bar Search Results', places: response.data.results, search: req.body.bar_name, query: req.body.bar_name, page_token: response.data.next_page_token, bucketlist: bucketlist[0].bucketlist, favourites: favourites[0].favourites });

        })
        .catch(function(error) {
            console.log(error);
        });
});

router.post('/area-search', async(req, res) => {

    let input = req.body.area_name;

    input = input.replace(/ /gi, "%20")

    let username = USERNAME;
    let users = schemas.user;
    let bucketlist = await users.find({
        username: username
    }, {
        bucketlist: { id: 1 }
    }).lean().exec();

    let favourites = await users.find({
        username: username
    }, {
        favourites: { id: 1 }
    }).lean().exec();

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
                    res.render('search/bar-search-results.hbs', { layout: 'user-layout', title: 'Bar Search Results', places: response.data.results, search: req.body.area_name, query: "bars%20near" + input, page_token: response.data.next_page_token, bucketlist: bucketlist[0].bucketlist, favourites: favourites[0].favourites });

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
    console.log(req.params.id)
    let user = await users.findOne({
        username: username
    }).lean().exec();

    let favourited = await users.findOne({
        username: username,
        bars: { $elemmatch: { bar: req.params.id, favourite: true } }
    }).lean().exec();
    console.log(favourited)

    let bucketlisted = await users.findOne({
        username: username,
        bars: { $elemmatch: { bar: req.params.id, bucketlist: true } }
    }).lean().exec();
    console.log(bucketlisted)

    let fav = false
    if (favourited.length > 0) {
        fav = true
    }

    let buck = false
    if (bucketlisted.length > 0) {
        buck = true
    }


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
            res.render('search/bar.hbs', { layout: 'user-layout', title: "Bar Details", place_data: response.data.result, bucketlisted: buck, favourited: fav, tags: user.tags });
        })
        .catch(function(error) {
            console.log(error);
        });
});

router.post('/bar:id/tags', async(req, res) => {
    let username = USERNAME;
    let users = schemas.user;

    let bar_id = req.params.id;

    let array = []
    let user = await users.findOne({
        username: username
    }).lean().exec();

    let newEntry = ({
        id: bar_id,
        name: req.body.bar_name,
        address: req.body.bar_address
    });

    for (let tag of user.tags) {
        if (req.body[tag.tag]) {
            let current_tag = await users.findOneAndUpdate({
                username: username,
                tags: { $elemMatch: { tag: tag.tag } }
            }, { $addToSet: { "tags.$.bars": newEntry } }).lean().exec();
        }
    }

    res.redirect('/search/bar' + bar_id);

});

router.post('/bar-favourite:bar_id', async(req, res) => {

    let username = USERNAME;
    let user = schemas.user;

    if (typeof req.body.favourite_button !== 'undefined') {
        let updatedUser = await user.findOneAndUpdate({ username: username }, {
            $push: {
                favourites: {
                    id: req.params.bar_id,
                    name: req.body.bar_name,
                    address: req.body.bar_address,
                    price_level: req.body.bar_price_level,
                    rating: req.body.bar_rating
                        // hours: req.body.bar_hours,
                        // location: req.body.bar_location
                },
                recent_activity: {
                    id: req.params.bar_id,
                    name: req.body.bar_name,
                    address: req.body.bar_address,
                    type: "favourited"
                }
            }
        });
    } else if (typeof req.body.bucketlist_remove !== 'undefined') {
        let updatedUser = await user.findOneAndUpdate({ username: username }, { $pull: { "bucketlist.id": req.params.bar_id } });
    } else if (typeof req.body.favourites_remove !== 'undefined') {
        let updatedUser = await user.findOneAndUpdate({ username: username }, { $pull: { "favourites.id": req.params.bar_id } });
    } else if (typeof req.body.bucketlist_button !== 'undefined') {
        let updatedUser = await user.findOneAndUpdate({ username: username }, {
            $push: {
                bucketlist: {
                    id: req.params.bar_id,
                    name: req.body.bar_name,
                    address: req.body.bar_address,
                    price_level: req.body.bar_price_level,
                    rating: req.body.bar_rating
                        // hours: req.body.bar_hours,
                        // location: req.body.bar_location
                },
                recent_activity: {
                    id: req.params.bar_id,
                    name: req.body.bar_name,
                    address: req.body.bar_address,
                    type: "bucketlisted"
                }
            }
        });
    }
    res.redirect('bar' + req.params.bar_id);

})

router.post('/bar-visit:bar_id', async(req, res) => {

    let username = USERNAME;
    let user = schemas.user;


    let updatedUser = await user.findOneAndUpdate({ username: username }, {
        $push: {
            recent_activity: {
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

    let e = document.getElementById("price_range");
    let value = e.value;

    let favourites = []
    let tagged = false
    for (let tag of user.tags) {
        if (req.body[tag.tag]) {
            tagged = true;
            console.log(tag.bars);
            favourites = favourites.concat(tag.bars);
        }
    }

    if (tagged == false) {
        favourites = user.favourites
    }

    res.render('search/favourites-search-results.hbs', { layout: 'user-layout', title: "Bar Details", favourites: favourites });
});

module.exports = router;