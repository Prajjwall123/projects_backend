const express = require('express');
const multer = require('multer');
const path = require('path');

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

router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const imageName = req.file.filename;
    const imageUrl = `images/${imageName}`;

    return res.status(200).json({ imageUrl });
});

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/get-user-profile', getUserProfile);

module.exports = router;
