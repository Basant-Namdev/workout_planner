const express = require('express');
const router = express.Router();
const workoutController = require('../controller/workoutController');

router
      .get('/chests', workoutController.individualWorkouts)
      .get('/backs', workoutController.individualWorkouts)
      .get('/shoulders', workoutController.individualWorkouts)
      .get('/biceps', workoutController.individualWorkouts)
      .get('/triceps', workoutController.individualWorkouts)
      .get('/legs', workoutController.individualWorkouts)
      .get('/customs', workoutController.individualWorkouts)

exports.router = router;