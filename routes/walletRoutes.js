const express = require("express");
const { getWalletBalanceByUser, getWalletBalanceByFreelancer, transferMoney } = require("../controller/walletController");

const router = express.Router();

router.get("/balance/:userId", getWalletBalanceByUser);

router.get("/balance/freelancer/:freelancerId", getWalletBalanceByFreelancer);

router.post("/transfer", transferMoney);


module.exports = router;
