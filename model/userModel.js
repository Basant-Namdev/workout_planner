const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true ,unique : true},
    password: { type: String, required: true },
    gender: {type:String},
    dob:{type:String},
    height:{type:String},
    weight:{type:String},
    profile:{type:String}
});

const feedbackSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true},
    profile:{type:String},
    feedback:{type:String, required: true},
    date:{type:String, required: true},
    time:{type:String, required: true},
    rating : {type:String},
    reason : {type:String}
});

exports.users = mongoose.model('users', userSchema);
exports.feedbacks = mongoose.model('feedbacks', feedbackSchema);