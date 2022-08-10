const express = require('express');
const router = express.Router();
var api_controller = require('../controllers/apiController');


router.get('/', (req, res) => {

    res.render('api-testing/neighbourhood-discovery.hbs', { layout: 'user-layout', title: 'API Testing' });
});

module.exports = router;