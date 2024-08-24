const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/verifyUser', userController.verifyUser);








// Example routes
router.get('/editUser/:id', userController.getEditUser); // Ensure userController.getEditUser exists
router.post('/updateUser/:id', userController.updateUser); // Ensure userController.updateUser exists
router.get('/deleteUser/:id', userController.deleteUser); // Ensure userController.deleteUser exists
module.exports = router;


module.exports = router;






