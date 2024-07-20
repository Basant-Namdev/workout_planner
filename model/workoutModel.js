const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSchema = new Schema({
    img: { type: String},
    workoutName : { type: String},
    description: { type: String},
    reps: { type: Number},
    sets: {type: Number},
    time: {type: Number} 
});

exports.chest = mongoose.model('chest', workoutSchema);
exports.back = mongoose.model('back', workoutSchema);
exports.biceps = mongoose.model('biceps', workoutSchema);
exports.triceps = mongoose.model('triceps', workoutSchema);
exports.legs = mongoose.model('legs', workoutSchema);
exports.shoulder = mongoose.model('shoulder', workoutSchema);
exports.custom = mongoose.model('custom', workoutSchema);