const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  questionId: String,
  value: mongoose.Schema.Types.Mixed,   
  timeTakenSec: Number,
  correct: Boolean                      
});

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  stepIndex: { type: Number, default: 0 },
  status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
  responses: [responseSchema],
  categoryScores: { type: Map, of: Number },
  totalScore: Number
}, { timestamps: true });

const Attempt = mongoose.model("Attempt", attemptSchema);
module.exports = Attempt;