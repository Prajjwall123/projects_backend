const express = require('express');
const multer = require('multer');

const router = express.Router();

const { login, register, verifyOtp, getUserProfile } = require('../controller/AuthController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/register', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 }
]), register);

router.post('/login', login);
router.post('/verify-otp', verifyOtp);

module.exports = router;
