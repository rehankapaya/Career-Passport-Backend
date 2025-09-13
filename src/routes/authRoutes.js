const router = require('express').Router();
const { loginAny } = require('../controllers/authController');

router.post('/login', loginAny);

module.exports = router;
