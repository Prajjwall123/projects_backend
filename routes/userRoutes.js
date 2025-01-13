const express = require('express');
const router = express.Router();

const { getAll, create, getUserById, deleteUser, updateUser, loginUser } = require("../controller/userController");

router.get('/', getAll);
router.post('/', create);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post('/login', loginUser);

module.exports = router;