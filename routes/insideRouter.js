const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const upload = multer({ dest: 'uploads/' })
const insideController = require('../controller/insideController');

router
.get('/feedback',insideController.feedbackForm)
.post('/feedback',insideController.userFeedback)
.get('/userDetails',insideController.userDetails)
.get('/editDetails',insideController.editDetails)
.post('/save',upload.single('avatar'),insideController.saveDetails)
exports.router = router;