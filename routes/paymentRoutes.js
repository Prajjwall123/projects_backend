const express = require("express");
const { initiateTransaction, verifyTransaction } = require("../controller/paymentController");

const router = express.Router();

router.post("/initiate", initiateTransaction);

router.post("/verify", verifyTransaction);

module.exports = router;
