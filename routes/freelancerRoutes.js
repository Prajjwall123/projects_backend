const express = require("express");

const router = express.Router();

const { getAllFreelancers, createFreelancer, getFreelancerById, updateFreelancer, deleteFreelancer } = require("../controller/freelancerController");

router.get("/", getAllFreelancers);
router.post("/", createFreelancer);
router.get("/:id", getFreelancerById);
router.put("/:id", updateFreelancer);
router.delete("/:id", deleteFreelancer);

module.exports = router;
