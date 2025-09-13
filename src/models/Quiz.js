const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ["mcq", "slider", "likert"], required: true },
  text: { type: String, required: true },
  options: [String],            
  min: Number, max: Number,     
  likertScale: { type: Number, default: 5 }, 
  category: { type: String, required: true }, 
  timeLimitSec: { type: Number, default: 30 } 
});

const quizSchema = new mongoose.Schema({
  title: String,
  steps: [[questionSchema]] 
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;