const express = require('express');
const { startAttempt, finishAttempt, saveStep, historyForUser, getAllAttempts } = require('../controllers/attemptController');
const router = express.Router();


router.post("/start", startAttempt);
router.post("/:attemptId/step", saveStep);
router.post("/:attemptId/finish", finishAttempt);
router.get("/history/:userId", historyForUser);
router.get("/history", getAllAttempts);
module.exports = router;