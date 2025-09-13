const Quiz = require("../models/Quiz");


 const seedSampleQuiz = async (req, res) => {
  const exists = await Quiz.findOne();
  if (exists) return res.json({ ok: true, quizId: exists._id });

  const quiz = await Quiz.create({
    title: "Career Orientation Quiz",
    steps: [
      [
        { type: "mcq", text: "Which task sounds fun?", options: ["Analyze data", "Design UI", "Fix servers", "Write content"], category: "Aptitude", timeLimitSec: 25 },
        { type: "slider", text: "Rate your math comfort", min: 0, max: 10, category: "Data", timeLimitSec: 20 }
      ],
      [
        { type: "likert", text: "I enjoy collaborating with teams", options: ["Strongly Disagree","Disagree","Neutral","Agree","Strongly Agree"], likertScale: 5, category: "Soft", timeLimitSec: 20 },
        { type: "mcq", text: "Pick a hobby", options: ["Photography","Robotics","Blogging","App design"], category: "Interest", timeLimitSec: 25 }
      ]
    ]
  });
  res.json({ ok: true, quizId: quiz._id });
};

 const getQuiz = async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  res.json(quiz);
};

module.exports = { seedSampleQuiz, getQuiz };