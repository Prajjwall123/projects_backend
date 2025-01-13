const express = require("express");
const { authenticateToken } = require("../security/Auth")

const router = express.Router();

const { getAllFreelancers, createFreelancer, getFreelancerById, updateFreelancer, deleteFreelancer } = require("../controller/freelancerController");

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
router.post("/", upload.single('file'), createFreelancer);
router.get("/:id", getFreelancerById);
router.put("/:id", authenticateToken, updateFreelancer);
router.delete("/:id", authenticateToken, deleteFreelancer);

module.exports = router;