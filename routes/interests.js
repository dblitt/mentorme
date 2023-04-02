const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', (req, res, next) => {
    // console.log(req.session)
    resOptions = {};
    if (req.session.loggedIn) {
        User.find({
            email: req.session.email
        }).then(doc => {
            if (doc.length > 0) {
                // console.log(doc[0])
                // console.log(doc[0].interests);
                // console.log(!doc[0].interests)
                resOptions.firstName = doc[0].first_name ?? 'No First Name Given'
                if (!doc[0].interests || !doc[0].mentor) {
                    res.render('pages/interests.ejs', resOptions);
                } else {
                    // console.log('fdfdsfs')
                    res.redirect('/dashboard');
                }
            } else {
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
