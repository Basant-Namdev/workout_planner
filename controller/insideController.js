const express = require('express');
const ejs = require('ejs');
const path = require('path');
const model = require('../model/userModel');
const users = model.users;
const feedbacks = model.feedbacks;
const fs = require("fs");

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
exports.saveDetails = async (req, res) => {
    try {
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        const user = await users.findById(req.user);
        if (req.file) {
            fs.rename(`uploads/${req.file.filename}`, `uploads/${user.username}`, (err) => {
                if (err) throw err;
            });
            const filepath = "/uploads/" + user.username;
            user.profile = filepath;
        }
        user.name = req.body.name;
        user.dob = (req.body.dob).split("T")[0];
        user.weight = req.body.weight;
        user.height = req.body.height;
        user.gender = req.body.gender;
        await user.save().then(() => { res.redirect("/profile/userDetails"); }).catch(err => {
            res.sendStatus(500);
            console.log(err);
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error.pls try again later.' })
    }

}

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
