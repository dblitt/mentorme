const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    const resOptions = {};
    resOptions.loggedIn = req.session.loggedIn ?? false;
    res.render('pages/leaderboard.ejs', resOptions);
});

module.exports = router;
