const express = require('express');
const router = express.Router();

const User = require('../models/user.js')

router.get('/', (req, res, next) => {
    if (req.session.loggedIn) {
        User.find({
            email: req.session.email
        }).then(doc => {
            if (doc.length > 0) {
                User.updateOne({_id: doc[0]._id}, {$set: {
                    interests: '',
                    mentor: ''
                }}).exec().then(response => {
                    res.redirect('/');
                }).catch(err => {
                    console.error(err)
                })
            }
        }).catch(err => {
            console.error(err)
        })
    } else {
        res.redirect('/dashboard');
    }
});

module.exports = router;
