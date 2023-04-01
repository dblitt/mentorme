const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');

const User = require('../../models/user.js');

router.post('/auth', (req, res, next) => {
    // If already logged in, redirect to dashboard
    if (req.session.loggedIn) {
        res.status(200).json({
            success: true,
            loggedIn: true,
            redirectTo: '/dashboard'
        });
    } else {
        if (req.body.email) {
            User.find({
                email: req.body.email
            }).then(doc => {
                if (doc.length > 0) {
                    req.session.email = doc[0].email;
                    req.session.firstName = doc[0].first_name;
                    req.session.lastName = doc[0].last_name;
                    req.session.loggedIn = true;
                    // console.log(doc[0]);
                    res.status(200).json({
                        success: true,
                        loggedIn: true,
                        // userType: 'student',
                        redirectTo: '/dashboard'
                    });
                } else {
                    // No user
                    req.session.loggedIn = false;
                    res.status(200).json({
                        success: true,
                        loggedIn: false,
                        message: 'Login unsuccessful: unknown email or password',
                        redirectTo: '/login'
                    });
                }
            });
        } else {
            // Correct body not supplied
            res.status(400).json({
                success: false,
                loggedIn: false,
                error: 'Correct body not supplied',
                redirectTo: '/login'
            });
        }
    }
});

router.get('/logout', (req, res, next) => {
    req.session.loggedIn = false;
    res.status(200).json({
        success: true,
        loggedIn: false,
        redirectTo: '/'
    });
});

router.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Internal server error'
    });
});

module.exports = router;
