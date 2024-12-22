const express = require("express");
const router = express.Router();
const freelancerController = require("../controller/freelancerController");

router.get("/", freelancerController.getAllFreelancers);

router.post("/", freelancerController.createFreelancer);

router.get("/:id", freelancerController.getFreelancerById);

router.put("/:id", freelancerController.updateFreelancer);

router.delete("/:id", freelancerController.deleteFreelancer);

module.exports = router;
