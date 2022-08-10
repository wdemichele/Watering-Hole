const { response } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json());

router.get('/', (_req, res) => {
    let place_id = "ChIJ41lATiVo1moRzmbzZaaIcPE";

    let config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&fields=name%2Crating%2Cformatted_phone_number%2Cformatted_address%2Copening_hours%2Cprice_level%2Ctypes%2Cwebsite%2Cphotos&key=AIzaSyA8P18svM3ddTHDUV21aw8JGCcfwN0UGjw',
        headers: {}
    };

    axios(config)
        .then(function(response) {
            console.log(JSON.stringify(response.data.result));
            res.render('api-testing/neighbourhood-discovery.hbs', { layout: 'user-layout', title: 'API Testing', place_data: response.data.result });

        })
        .catch(function(error) {
            console.log(error);
        });
});

module.exports = router;