const path = require('path');
const model = require('../model/userModel');
const users = model.users;
const feedbacks = model.feedbacks;
const transformations = model.transformations;
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
require('dotenv').config();

// contact us form submission code
exports.formSubmission = (req, res) => {
  try {
    // handle form submission here
    // e.g., store data in database, send email, etc.
    // for demonstration purposes, just return a success response
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error.pls try again later.' })
  }

}
// it renders feedbacks saved in database on reviews page
exports.reviews = async (req, res) => {
  try {
    const feedback = await feedbacks.find();
    ejs.renderFile(path.resolve(__dirname, '../views/reviews.ejs'), { feedbacks: feedback }, (err, str) => {
      if (!err) res.send(str);
      else {
        console.log(err);
        res.sendStatus(404);
      }
    })
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error.pls try again later.' })
  }

}

// it is to create a user in db

var salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
exports.signUp = async (req, res) => {
  try {
    const user = await users.find({ username: req.body.username });

    if (user.length > 0) { return res.status(400).json({ message: "Email already in use" }); }
    const newUser = new users();
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);


    newUser.name = req.body.name;
    newUser.username = req.body.username;
    newUser.password = hashedPassword.toString('hex');
    newUser.save()
      .then(() => {
        res.status(201).json({ success: true })
      })
      .catch(error => {
        console.log("Error Creating User", error);
        res.status(500).json({ success: false })
      })
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error.pls try again later.' })
  }



};
// user login function
exports.login = (req, res, next) => {
  try {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ success: false });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({ redirectUrl: '/profile' });
      });
    })(req, res, next);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error.pls try again later.' })
  }
}
// middleware between login to profile
exports.isAuth = (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect('/');
    }
    return next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error.pls try again later.' })
  }

}
// it opens user profile
exports.openProfile = async (req, res) => {
  try {
    const user = await users.findById(req.user)
    ejs.renderFile(path.resolve(__dirname, '../views/profile.ejs'), { user: user }, function (err, str) {
      res.send(str);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error.pls try again later.' })
  }

}
// logout function
exports.logOut = (req, res, next) => {
  try {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error.pls try again later.' })
  }

};
// passport initialization
exports.initializePass = (passport) => {
  passport.use(new localStrategy(async function verify(username, password, done) {
    const user = await users.findOne({ username });

    if (!user) { return done(null, false); }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return done(err);
      }
      if (!result) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    });

  }));

  passport.serializeUser((user, done) => {
    console.log("on");
    done(null, user._id)
  });

  passport.deserializeUser(async function (user, done) {
    console.log("off");
    done(null, user);
  });
};
