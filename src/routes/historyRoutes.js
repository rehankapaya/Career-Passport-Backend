const express = require('express');
const { saveHistory, getUserHistory } = require('../controllers/historyController');
const router = express.Router();

router.post("/", saveHistory);
router.get("/:userId", getUserHistory);

module.exports= router;
