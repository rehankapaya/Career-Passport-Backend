const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");

const scoreResponse = (q, value) => {
  // Simple demo scoring you can improve later
  if (q.type === "mcq") return 1;                 // equal weight
  if (q.type === "slider") return Number(value);  // 0..10 scale
  if (q.type === "likert") return Number(value);  // 1..5
  return 0;
};

 const startAttempt = async (req, res) => {
  const { userId, quizId } = req.body;
  const attempt = await Attempt.create({ userId, quizId, stepIndex: 0 });
  res.json(attempt);
};

 const saveStep = async (req, res) => {
  const { attemptId } = req.params;
  const { responses, stepIndex } = req.body; // [{questionId,value,timeTakenSec},...]

  const attempt = await Attempt.findById(attemptId).populate("quizId");
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });

  // merge responses
  attempt.responses.push(...responses);

  // compute category scores from this step
  const quiz = await Quiz.findById(attempt.quizId);
  const stepQuestions = quiz.steps[stepIndex];
  for (const r of responses) {
    const q = stepQuestions.find(q => String(q._id) === r.questionId);
    if (!q) continue;
    const add = scoreResponse(q, r.value);
    const prev = attempt.categoryScores?.get(q.category) || 0;
    attempt.categoryScores = attempt.categoryScores || new Map();
    attempt.categoryScores.set(q.category, prev + add);
  }

  attempt.stepIndex = stepIndex + 1;
  await attempt.save();
  res.json({ ok: true, nextStep: attempt.stepIndex });
};

 const finishAttempt = async (req, res) => {
  const { attemptId } = req.params;
  const attempt = await Attempt.findById(attemptId);
  attempt.status = "completed";
  // sum map values
  let total = 0;
  for (const v of attempt.categoryScores?.values() || []) total += v;
  attempt.totalScore = total;
  await attempt.save();
  res.json(attempt);
};

 const historyForUser = async (req, res) => {
  const { userId } = req.params;
  const list = await Attempt.find({ userId }).sort({ createdAt: -1 });
  res.json(list);
};

module.exports = { startAttempt, saveStep, finishAttempt, historyForUser };