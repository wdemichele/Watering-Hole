const express = require('express');
const router = express.Router();
const apiRouter = require('./apiRouter');
router.use('/api', apiRouter);


router.get('/', (_req, res) => {

    res.render('api-testing/api-testing.hbs', { layout: 'user-layout', title: 'API Testing' });
});


module.exports = router;