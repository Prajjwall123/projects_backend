const express = require('express');
const router = express.Router();
const UserValidation = require('../validation/userValidation');

const { login, register, verifyOtp } = require("../controller/AuthController");


router.post('/register', UserValidation, register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);

module.exports = router;