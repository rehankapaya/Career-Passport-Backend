const { Router } = require("express");
const { seedSampleQuiz, getQuiz } = require("../controllers/quizController.js");
const router = Router();
router.post("/seed", seedSampleQuiz);
router.get("/:quizId", getQuiz);
module.exports = router;