const express = require('express');
const router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
const outsideController = require('../controller/outsideController');

outsideController.initializePass(passport);
router
    .get('/reviews',outsideController.reviews)
    .post('/signUp', outsideController.signUp)
    .post('/login',outsideController.login)
    .get('/profile',outsideController.isAuth,outsideController.openProfile)
    .post('/submit',outsideController.formSubmission)
    .get('/profile/logout', outsideController.logOut)
    
exports.router = router;