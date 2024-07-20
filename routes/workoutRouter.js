const express = require('express');
const router = express.Router();
const workoutController = require('../controller/workoutController');

router
      .get('/workouts', workoutController.workouts)
      .get('/workouts/chests', workoutController.individualWorkouts)
      .get('/workouts/backs', workoutController.individualWorkouts)
      .get('/workouts/shoulders', workoutController.individualWorkouts)
      .get('/workouts/biceps', workoutController.individualWorkouts)
      .get('/workouts/triceps', workoutController.individualWorkouts)
      .get('/workouts/legs', workoutController.individualWorkouts)
      .get('/workouts/cardios', workoutController.individualWorkouts)
      .get('/workouts/customs', workoutController.individualWorkouts)

exports.router = router;