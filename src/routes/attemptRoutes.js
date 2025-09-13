const express = require('express');
const { startAttempt, finishAttempt, saveStep, historyForUser } = require('../controllers/attemptController');
const router = express.Router();


router.post("/start", startAttempt);
router.post("/:attemptId/step", saveStep);
router.post("/:attemptId/finish", finishAttempt);
router.get("/history/:userId", historyForUser);
module.exports = router;