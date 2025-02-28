const express = require("express");
const { authenticateToken, authorizeRole } = require("../security/Auth")

const router = express.Router();

const { getAllFreelancers, getFreelancerById, updateFreelancer, deleteFreelancer, getFreelancerByUserId } = require("../controller/freelancerController");

const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })

router.get("/", getAllFreelancers);
router.get("/:id", getFreelancerById);
router.get("/user/:id", getFreelancerByUserId);
router.put("/:id", authenticateToken, authorizeRole("freelancer"), updateFreelancer);
router.delete("/:id", authenticateToken, authorizeRole("freelancer"), deleteFreelancer);

module.exports = router;