const express = require('express');
const router = express.Router();

const { getAll, create, getUserById, deleteUser, updateUser, loginUser } = require("../controller/userController");
const UserValidation = require('../validation/userValidation');

router.get('/', getAll);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;