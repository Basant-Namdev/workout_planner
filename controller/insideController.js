const express = require('express');
const ejs = require('ejs');
const path = require('path');
const model = require('../model/userModel');
const users = model.users;
const feedbacks = model.feedbacks;
//const { MongoClient } = require('mongodb');
//const uri = process.env.MONGODB_URL;
//const client = new MongoClient(uri);
//const db = client.db('workout_planner');
const cloudinary = require('cloudinary').v2;

// cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});
// to view the detail of the user when user is logged in
exports.userDetails = async (req, res) => {
    try {
        const user = await users.findById(req.user);
        ejs.renderFile(path.resolve(__dirname, '../views/userDetails.ejs'), { user: user }, (err, str) => {
            if (!err) res.send(str);
            else {
                res.sendStatus(404);
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error.pls try again later.' })
    }

}
// it is to send the edit detail from 
exports.editDetails = async (req, res) => {
    try {
        const user = await users.findById(req.user);
        ejs.renderFile(path.resolve(__dirname, '../views/editProfile.ejs'), { user: user }, (err, str) => {
            if (!err) res.send(str);
            else {
                res.sendStatus(404);
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error.pls try again later.' })
    }

}
// it stores the details got from editform 
exports.saveDetails = async (req, res) => {
    // Upload an image
    const user = await users.findById(req.user);
    const file = req.files.avatar;
    let filepath;
    await cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'internal server error.pls try again later.'
            })
        }else{
                filepath = result.url;
            }
    })
    try {
        //const sameUserFeedback = await db.collection(feedbacks).find({"userId" : req.user}).toArray();
        //for(let i = 0; i< sameUserFeedback;i++){
           // sameUserFeedback[i].profile = filepath;
       // }
        user.profile = filepath;
        user.name = req.body.name;
        user.dob = (req.body.dob).split("T")[0];
        user.weight = req.body.weight;
        user.height = req.body.height;
        user.gender = req.body.gender;
        await user.save().then(() => { res.redirect("/profile/userDetails"); }).catch(err => {
            console.log(err);
            return res.sendStatus(500);
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error.pls try again later.' })
    }

}
// it send feedbackForm 
exports.feedbackForm = (req, res) => {
    try {
        ejs.renderFile(path.resolve(__dirname, '../views/feedback.ejs'), (err, str) => {
            if (!err) res.send(str);
            else {
                res.sendStatus(404);
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error.pls try again later.' })
    }

};
// it saves feedback in database
exports.userFeedback = async (req, res) => {
    try {
        // date calculator
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
        // time calculator
        function formatTime(number) {
            return (number < 10 ? '0' : '') + number;
        }
        let now = new Date();
        let hours = formatTime(now.getHours());
        let minutes = formatTime(now.getMinutes());
        let currentTime = `${hours}:${minutes}`;
        // feedback saving part
        const user = await users.findById(req.user);
        const feedback = new feedbacks();
        feedback.name = user.name;
        feedback.username = user.username;
        feedback.profile = user.profile;
        feedback.userId = user._id;
        feedback.date = currentDate;
        feedback.time = currentTime;
        feedback.feedback = req.body.feedbackBox;
        feedback.rating = req.body.rating;
        feedback.reason = req.body.opt;
        await feedback.save().then(() => { res.json({ success: true }); }).catch(err => {
            res.sendStatus(500);
            console.log(err);
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error.pls try again later.' })
    }

}
