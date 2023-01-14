const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();


router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.delete('/deletelogin/(:id)', userController.deleteLogin);
router.get('/getuser', userController.getAllUser);
router.get('/getlogin', userController.getUserLogin);


module.exports = router;