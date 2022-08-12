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

router.get('/user', async(_req, res) => {

    let username = "jane-smith";
    let users = schemas.user;
    let user = await users.findOne({ username: username }).lean().exec();

    let bar_id = user.recent_bars[0].id
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
            res.render('user-profile.hbs', { layout: 'user-layout', title: 'User Results', place_data: response.data.result });

        })
        .catch(function(error) {
            console.log(error);
        });
});

module.exports = router;