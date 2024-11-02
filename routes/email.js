const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email');
const {verifyToken} = require('../middlewares/authMiddleware');

router.post('/send-email', verifyToken, emailController.createEmail);
router.post('/get-email', verifyToken, emailController.getEmail);
router.put('/edit-email', verifyToken, emailController.editEmail);
router.delete('/delete-email/:id', verifyToken, emailController.deleteEmail);

module.exports = router;
