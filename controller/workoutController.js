const ejs = require('ejs');
const path = require('path');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri);
const db = client.db('workout_planner');
require('dotenv').config();

exports.workouts = (req, res) => {
    try {
        ejs.renderFile(path.resolve(__dirname, '../views/workout.ejs'), (err, str) => {
            if (!err) res.send(str);
            else res.sendStatus(404);
        })
    } catch (error) {
        console.log(err);
        res.status(500).send({ message: 'internal server error.pls try again later.' })
    }
    
};

exports.individualWorkouts = async (req, res) => {
    try {
        const bodyPartName = req.url.split('/')[2];
        const url = "/profile" + req.url;
        const bodyPart = await db.collection(bodyPartName).find().toArray();
        ejs.renderFile(path.resolve(__dirname, '../views/individualWorkouts.ejs'), { bodyParts: bodyPart,body:bodyPartName,url:url }, (err, str) => {
            if (!err) res.send(str);
            else {
                console.log(err);
                res.sendStatus(404);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error.pls try again later.' })
    }
};
