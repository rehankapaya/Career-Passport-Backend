const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ["mcq", "slider", "likert"], required: true },
  text: { type: String, required: true },
  options: [String],            // for MCQ/Likert labels
  min: Number, max: Number,     // for slider
  likertScale: { type: Number, default: 5 }, // 5 or 7
  category: { type: String, required: true }, // e.g. "Data", "Design", ...
  timeLimitSec: { type: Number, default: 30 } // per-question timer
});

const quizSchema = new mongoose.Schema({
  title: String,
  steps: [[questionSchema]] // array of steps, each step = array of questions
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;