const express = require("express");
const router = express.Router();

const { getBiddingsByProject, getAllBiddings, deleteBidding, updateBidding, createBidding, getBiddingCountByProject } = require("../controller/biddingController");

router.post("/create", createBidding);
router.put("/update/:id", updateBidding);
router.delete("/delete/:id", deleteBidding);
router.get("/all", getAllBiddings);
router.get("/project/:projectId", getBiddingsByProject);
router.get("/count/:projectId", getBiddingCountByProject);


module.exports = router;