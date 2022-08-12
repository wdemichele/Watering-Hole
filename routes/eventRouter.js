const { response } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios');
const schemas = require('../models/userSchema');

router.get('/', (_req, res) => {

    res.render('events/event-search.hbs', { layout: 'user-layout', title: 'Event Search' });
});



module.exports = router;