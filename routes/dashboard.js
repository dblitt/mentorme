const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/', (req, res, next) => {
    const resOptions = {}
    if (req.session.loggedIn) {
        User.find({
            email: req.session.email
        }).then(doc => {
            if (doc.length > 0) {
                if (!doc[0].interests || !doc[0].mentor) {
                    res.redirect('/interests');
                } else {
                    const id = doc[0]._id
                    resOptions.firstName = doc[0].first_name ?? "ERROR_NO_FIRST_NAME"
                    resOptions.lastName = doc[0].last_name ?? "ERROR_NO_LAST_NAME"
                    resOptions.mentorReasoning = doc[0].mentor_reasoning ?? "ERROR_NO_MENTOR_REASONING"
                    if (doc[0].mentor) {
                        User.find({_id: doc[0].mentor}).then(mentorDoc => {
                            if (mentorDoc.length > 0) {
                                resOptions.mentorFirstName = mentorDoc[0].first_name ?? "ERROR_NO_MENTOR_FIRST_NAME"
                                resOptions.mentorLastName = mentorDoc[0].last_name ?? "ERROR_NO_MENTOR_LAST_NAME"
                                resOptions.mentorImageUrl = mentorDoc[0].image_url ?? "ERROR_NO_MENTOR_IMAGE_URL"
                                resOptions.mentorInterests = mentorDoc[0].interests ?? "ERROR_NO_MENTOR_INTERESTS"

                                res.status(200).render('pages/dashboard.ejs', resOptions)
                            } else {

                            }
                        })
                    } else {

                    }
                }
            } else {

            }
        })
    } else {
        res.redirect('/login')
    }
    // res.render('pages/dashboard.ejs');

    // if (req.session.loggedIn && req.session.userType === 'admin') {
    //     let resOptions = {};
    //     resOptions.firstName = req.session.firstName;
    //     User.countDocuments({user_type: 'student'}, (err, count) => {
    //         if (err) {
    //             console.error(err);
    //             const error = new Error('Internal server error');
    //             error.status = 500;
    //             next(error);
    //         } else {
    //             // subtract one while there is a dummy student account
    //             resOptions.studentCount = count - 1;
    //             Submission.find({
    //                 reviewed: false
    //             }).then(doc => {
    //                 resOptions.newSubmissions = doc;
    //                 // first determine the latest project
    //                 // find projects with unix timestamp greater than current time
    //                 Project.find({}).then(doc => {
    //                     // doc is an array of all documents
    //                     // make a new array with all documents greater than current unix time
    //                     // console.log('test1')
    //                     // console.log(doc)
    //                     const currentProjects = doc.filter(document => {
    //                         return Number(document.deadline) > Math.round(new Date().getTime() / 1000);
    //                     });
    //                     // console.log('test2')
    //                     // console.log(currentProjects)
    //                     // sort currentProjects array by deadline
    //                     currentProjects.sort((a, b) => Number(a.deadline) - Number(b.deadline));
    //                     const currentProject = currentProjects[0];
    //                     if (currentProject === undefined) {
    //                         // There is no current project
    //                         resOptions.currentProjectExists = false;
    //                         res.render('pages/admin.ejs', resOptions);
    //                     } else {
    //                         // There is a current project
    //                         resOptions.currentProjectExists = true;
    //                         resOptions.currentProjectTitle = currentProject.name;
    //                         Submission.countDocuments({'project_id': currentProject._id + ''}, (err, count) => {
    //                             if (err) {
    //                                 console.error(err);
    //                                 const error = new Error('Internal server error');
    //                                 error.status = 500;
    //                                 next(error);
    //                             } else {
    //                                 resOptions.currentProjectSubmissions = count;
    //                                 res.render('pages/admin.ejs', resOptions);
    //                             }
    //                         });
    //                     }
    //                 });
    //             });
    //         }
    //     });
    // } else if (req.session.loggedIn && req.session.userType === 'student') {
    //     res.redirect('/dashboard');
    // } else {
    //     res.redirect('/login');
    // }
});

module.exports = router;
