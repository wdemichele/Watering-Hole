const { response } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios');
const schemas = require('../models/userSchema');

router.get('/', (_req, res) => {

    res.render('events/event-search.hbs', { layout: 'user-layout', title: 'Event Search' });
});

router.get('/event:event_id', async(req, res) => {

    let params = new URLSearchParams();

    params.append("expand", "ticket_availability");
    params.append("expand", "category");
    params.append("expand", "venue");
    params.append("token", "S2LOLLZODMIJKKZCEJRP");
    console.log(params)
    let response = await axios.get('https://www.eventbriteapi.com/v3/events/' + req.params.event_id + '/', {
        params: params

    });

    console.log(response.data);
    res.render('events/event.hbs', { layout: 'user-layout', title: 'Event Search', event: response.data });
});

router.get('/venue:venue_id', async(req, res) => {

    let params = new URLSearchParams();

    params.append("status", "live");
    params.append("token", "S2LOLLZODMIJKKZCEJRP");
    //need to limit is_series
    let config = {
        method: 'get',
        url: 'https://www.eventbriteapi.com/v3/venues/' + req.params.venue_id + '/events/',
        headers: {},
        params: params
    };

    axios(config)
        .then(function(response) {
            console.log(response.data.events);
            res.render('events/venue-search.hbs', { layout: 'user-layout', title: 'Venue Events', events: response.data.events });
        })
        .catch(function(error) {
            console.log(error);
        });
});



module.exports = router;