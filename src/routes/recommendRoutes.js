const express = require('express');
const { getRecommendations } = require('../controllers/recommendController');
const router = express.Router();


router.get("/:attemptId", getRecommendations);

module.exports = router;