const express = require('express');
const router = express.Router();
const UserValidation = require('../validation/userValidation');

const { login, register } = require("../controller/AuthController");

router.post('/login', login);
router.post('/register', UserValidation, register);

module.exports = router;