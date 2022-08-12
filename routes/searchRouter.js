const { response } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios');
const schemas = require('../models/userSchema');


router.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json());

router.get('/', async(_req, res) => {

    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();
    console.log(user);

    res.render('user-profile.hbs', { layout: 'user-layout', title: 'User Results', user: user });
});

router.get('/bar-search', async(_req, res) => {

    res.render('search/bar-search.hbs', { layout: 'user-layout', title: 'Bar Search' });
});

router.post('/bar-search', async(req, res) => {

    let input = req.body.bar_name;

    input = input.replace(/ /gi, "%20")

    let config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + input + '&inputtype=textquery&fields=formatted_address%2Cplace_id%2Cname%2Crating%2Copening_hours%2Cgeometry%2cphotos&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        headers: {}
    };

    axios(config)
        .then(function(response) {
            // console.log(response.data.candidates);
            res.render('search/bar-search-results.hbs', { layout: 'user-layout', title: 'Bar Search Results', places: response.data.candidates, search: req.body.bar_name });

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
                    res.render('search/bar-search-results.hbs', { layout: 'user-layout', title: 'Bar Search Results', places: response.data.results, search: req.body.area_name });

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

    let bar_id = req.params.id;
    // Revs: ChIJ41lATiVo1moRzmbzZaaIcPE
    // Union Electric: ChIJ7_FCh8lC1moRPc7-4Iwg5WE
    let config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + bar_id + '&fields=name%2Crating%2Cformatted_phone_number%2Cformatted_address%2Copening_hours%2Cprice_level%2Ctypes%2Cwebsite%2Cphotos&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        headers: {}
    };

    axios(config)
        .then(function(response) {
            // console.log(JSON.stringify(response.data.result));
            res.render('search/bar.hbs', { layout: 'user-layout', title: "Bar Details", place_data: response.data.result });
        })
        .catch(function(error) {
            console.log(error);
        });
});

router.post('/bar-favourite:bar_id', async(req, res) => {

    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    // now format the incoming entry
    let newEntry = ({
        id: req.params.bar_id,
        name: req.body.bar_name
    });

    // add data to end of patients' entries array
    user.favourites.push(newEntry);
    const updated = await user.save();

    res.redirect('/bar:' + req.params.bar_id);

})

module.exports = router;