
const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');

router.post('/verifySignup', (req, res, next) => {
    console.log('POST /verifySignup request received');
    next(); // Proceed to the actual handler
}, signupController.verifySignup);
module.exports = router;
