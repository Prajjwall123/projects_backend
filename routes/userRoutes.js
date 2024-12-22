const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.getAll);
router.post('/', userController.create);

module.exports = router;