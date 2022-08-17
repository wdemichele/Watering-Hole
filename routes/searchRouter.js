const { response } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios');
const schemas = require('../models/userSchema');
const { Db } = require('mongodb');
const isset = require('isset-php')


router.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json());

router.get('/bar-search', async(_req, res) => {

    res.render('search/bar-search.hbs', { layout: 'user-layout', title: 'Bar Search' });
});

router.get('/hotel-search', async(_req, res) => {
    res.render('search/hotel-search.hbs', { layout: 'google-layout', title: 'Hotel Search' });
});

router.get('/map-search', (_req, res) => {

    res.render('search/map-search.hbs', { layout: 'user-layout', title: 'Map Search', query: "bars%20near%20Chapel%20Street%2C%20South%20Yarra%20VIC%2C%20Australia" });
});

router.post('/map-search', async(_req, res) => {

    res.render('search/map-search.hbs', { layout: 'user-layout', title: 'Map Search', query: "bars%20near%20Chapel%20Street%2C%20South%20Yarra%20VIC%2C%20Australia" });
});

router.get('/map', async(_req, res) => {

    res.render('search/map.hbs', { layout: 'user-layout', title: 'Map' });
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
    let input = req.body.bar_name;

    let config = {
        method: 'get',
        url: "https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=" + page_token + "&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw",
        headers: {}
    };

    axios(config)
        .then(function(response) {
            console.log(response.data.next_page_token)
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
        url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + input + '&inputtype=textquery&fields=formatted_address%2Cplace_id%2Cname%2Crating%2Copening_hours%2Cgeometry%2cphotos&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        headers: {}
    };

    //input=' + req.body.area_bar + '&
    // &keyword=cruise

    axios(config)
        .then(function(response) {
            console.log(response.data.candidates);
            config = {
                method: 'get',
                url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + response.data.candidates[0].geometry.location.lat + '%2C' + response.data.candidates[0].geometry.location.lng + '&radius=' + req.body.area_radius + '&type=bar&fields=name%2Crating%2Cformatted_phone_number%2Cformatted_address%2Copening_hours%2Cprice_level%2Ctypes%2Cwebsite%2Cphotos&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
                headers: {}
            };
            console.log(config.url)
            axios(config)
                .then(function(response) {
                    console.log(response.data.results);
                    res.render('search/bar-search-results.hbs', { layout: 'user-layout', title: 'Bar Search Results', places: response.data.results, search: req.body.area_name, query: "bars%20near" + input });

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
    let username = "jane-smith";
    let users = schemas.user;
    let favourited = await users.count({
        username: username,
        bucketlist: { $elemMatch: { id: req.params.id } }
    }).lean().exec();

    let bucketlisted = await users.count({
        username: username,
        bucketlist: { $elemMatch: { id: req.params.id } }
    }).lean().exec();

    let bar_id = req.params.id;

    let config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + bar_id + '&fields=name%2Crating%2Cplace_id%2Cformatted_phone_number%2Cformatted_address%2Copening_hours%2Cprice_level%2Ctypes%2Cwebsite%2Cphotos&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        headers: {}
    };

    axios(config)
        .then(function(response) {
            res.render('search/bar.hbs', { layout: 'user-layout', title: "Bar Details", place_data: response.data.result, bucketlisted: bucketlisted > 0, favourited: favourited > 0 });
        })
        .catch(function(error) {
            console.log(error);
        });
});

router.post('/bar-favourite:bar_id', async(req, res) => {

    let username = "jane-smith";
    let user = schemas.user;

    if (typeof req.body.favourite_button !== 'undefined') {
        let updatedUser = await user.findOneAndUpdate({ username: username }, {
            $push: {
                favourites: {
                    id: req.params.bar_id,
                    name: req.body.bar_name,
                    address: req.body.bar_address
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
                    address: req.body.bar_address
                }
            }
        });
    }
    res.redirect('bar' + req.params.bar_id);

})

router.get('/favourites-search', async(_req, res) => {

    res.render('search/favourites-search.hbs', { layout: 'user-layout', title: 'Bar Favourites Search' });
});

router.post('/favourites-search', async(req, res) => {
    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    res.render('search/favourites-search-results.hbs', { layout: 'user-layout', title: "Bar Details", favourites: user.favourites });
});

module.exports = router;