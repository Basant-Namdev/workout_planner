const express = require('express');
const server = express();
const mongoose = require('mongoose');
const model = require('./model/userModel');
var passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const outsideRouter = require('./routes/outsideRouter');
const workoutRouter = require('./routes/workoutRouter');
const insideRouter = require('./routes/insideRouter');
require('dotenv').config();
const cors = require('cors');

main().catch(err => console.log(err));

async function main() {
  try {
    exports.dbConnection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("database connected");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
}
exports.main = main;


server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use('/uploads',express.static("uploads"));
server.use('/public',express.static("public"));
server.use(passport.initialize());

server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: process.env.MONGODB_URL })
}));
server.use(passport.authenticate('session'));

server.use('/',outsideRouter.router);
server.use('/profile',insideRouter.router);
server.use('/profile',workoutRouter.router);






server.listen(process.env.PORT, () => { console.log("Server is running ") });