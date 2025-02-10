const express = require("express");
const router = express.Router();

const { getBiddingsByProject, getAllBiddings, deleteBidding, updateBidding, createBidding } = require("../controller/biddingController");

router.post("/create", createBidding);
router.put("/update/:id", updateBidding);
router.delete("/delete/:id", deleteBidding);
router.get("/all", getAllBiddings);
router.get("/project/:projectId", getBiddingsByProject);

module.exports = router;