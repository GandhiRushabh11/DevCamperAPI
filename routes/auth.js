const express = require('express');
const { register, login, logout, getMe, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/auth');

const router = express.Router();
const { protect } = require('../middleware/auth')
router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword)
router.put('/resetPassword/:resettoken', resetPassword)
router.put('/updateDetails', protect, updateDetails).put('/updatePassword', protect, updatePassword)
router.get('/', protect, getMe).get('/logout', logout)
module.exports = router;