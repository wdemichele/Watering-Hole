const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {

    res.render('api-testing.hbs', { layout: 'user-layout', title: 'API Testing' });
});


module.exports = router;