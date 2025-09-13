const Attempt = require("../models/Attempt");
const { recommendFromScores } = require("../services/mappingService");

 const getRecommendations = async (req, res) => {
  const { attemptId } = req.params;
  const attempt = await Attempt.findById(attemptId);
  if (!attempt || attempt.status !== "completed")
    return res.status(400).json({ error: "Complete the quiz first." });

  const catScores = Object.fromEntries(attempt.categoryScores || []);
  const rec = await recommendFromScores(catScores);
  res.json({ attemptId, recommendations: rec });
};
module.exports = { getRecommendations };