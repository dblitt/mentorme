const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios')

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
                    console.log(doc[0])
                    console.log(doc[0].interests);
                    if (!doc[0].interests) {
                        res.status(200).json({
                            success: true,
                            loggedIn: true,
                            // userType: 'student',
                            redirectTo: '/interests'
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            loggedIn: true,
                            // userType: 'student',
                            redirectTo: '/dashboard'
                        });
                    }
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

router.post('/interests', (req, res, next) => {
    if (req.body.interests) {
        if (req.session.loggedIn) {
            User.find({
                email: req.session.email
            }).then(doc => {
                if (doc.length > 0) {
                    const id = doc[0]._id;
                    User.updateOne({ _id: id }, {$set: {
                        interests: req.body.interests
                    }}).exec().then(result => {
                        // res.status(200).json({
                        //     success: true,
                        //     redirectTo: '/dashboard'
                        // });
                        // call openai
                        User.find({
                            user_type: "mentor"
                        }).then(doc => {
                            console.log(doc)
                            const openAIObj = {}
                            openAIObj.mentee_description = req.body.interests;
                            openAIObj.mentors = []
                            doc.forEach(element => {
                                openAIObj.mentors.push({
                                    identifier: String(element._id),
                                    description: element.interests ?? ""
                                })
                            })
                            console.log(openAIObj)
                            axios.post('https://api.openai.com/v1/chat/completions', {
                                "model": "gpt-3.5-turbo",
                                "messages": [
                                    {"role": "system", "content": 'You are an AI robot. You will be given data about a mentee, who has given a description about themself, and a list of mentors identified by random identifiers, who have all provided descoriptions about themselves. The data will be provided in the following JSON format: {"mentee_description": "The Mentee Description", "mentors": [{"identifier": "59872", "description": "59872\'s description"}, {"identifier": "12373", "description": "12373\'s description"}]}. Pick the single best mentor for the mentee, and make your decision mostly in regards of academic interest. When explaining the reason the mentor was be chosen, be specific and verbose in your reasoning. Output your response as only the following JSON format: {"mentor_identifier": "identifier", "reason_for_picking_mentor": "Reason", "reasons_for_not_picking_other_mentors": "Reason", "string_to_show_mentee_why_their_mentor_was_chosen": "Name was chosento be your mentor because ..."}. Always refer to mentors using their First Name. Do not use their identifier. DO NOT PROVIDE ANY ADDITIONAL EXPLANATION. YOUR ANSWER SHOULD BEGIN AND END WITH THE JSON RESPONSE.'},
                                    {"role": "user", "content": JSON.stringify(openAIObj)}
                                ],
                                "temperature": 0.8
                            }, {
                                headers: {
                                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                                }
                            }).then(response => {
                                // console.log(response)
                                // console.log()
                                // console.log(response.data.choices[0].message)
                                console.log(JSON.parse(response.data.choices[0].message.content))
                                User.updateOne({ _id: id }, {$set: {
                                    mentor: JSON.parse(response.data.choices[0].message.content).mentor_identifier,
                                    mentor_reasoning: JSON.parse(response.data.choices[0].message.content).string_to_show_mentee_why_their_mentor_was_chosen
                                }}).exec().then(result => {
                                    console.log('saved mentor')
                                    res.status(200).json({
                                        success: true,
                                        redirectTo: '/dashboard'
                                    });
                                }).catch(err => {

                                })
                            })
                        })
                    }).catch(err => {

                    })
                } else {

                }
            });
        } else {

        }
    } else {

    }
})

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
