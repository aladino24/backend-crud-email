const express = require('express');
const userController = require('../controllers/user');
const {verifyToken} = require('../middlewares/authMiddleware'); 
const router = express.Router();

router.get('/verify-token', userController.verifyToken);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// middleware verifyToken 
router.delete('/deletelogin/:id', verifyToken, userController.deleteLogin);
router.get('/getuser', verifyToken, userController.getAllUser);
router.get('/getlogin', verifyToken, userController.getUserLogin);
router.get('/get-history-login/:id', verifyToken, userController.getHistoryLogin);

module.exports = router;