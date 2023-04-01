const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
    } else {
        res.render('pages/register.ejs');
    }
});

module.exports = router;
