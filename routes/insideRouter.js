const express = require('express');
const router = express.Router();
const insideController = require('../controller/insideController');

router
.get('/feedback',insideController.feedbackForm)
.post('/feedback',insideController.userFeedback)
.get('/userDetails',insideController.userDetails)
.get('/editDetails',insideController.editDetails)
.post('/save',insideController.saveDetails)
exports.router = router;