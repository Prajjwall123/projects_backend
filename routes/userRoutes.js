const express = require('express');
const router = express.Router();

userController = require('../controller/userController');

router.get('/', userController.getAll);
router.post('/', userController.create);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;