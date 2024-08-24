const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/adminHome', adminController.adminHome);
router.post('/verifyAdmin', adminController.verifyAdmin);

module.exports = router;

