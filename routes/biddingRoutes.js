const express = require("express");
const multer = require("multer");
const path = require("path");
const { getBiddingsByProject, getBiddingById, getAllBiddings, deleteBidding, updateBidding, createBidding, getBiddingCountByProject } = require("../controller/biddingController");
const { authenticateToken, authorizeRole } = require("../security/Auth")


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

// Routes
router.post("/create", upload.single("file"), createBidding);
router.get("/:id", getBiddingById);
router.put("/update/:id", updateBidding);
router.delete("/delete/:id", authenticateToken, authorizeRole("company"), deleteBidding);
router.get("/all", getAllBiddings);
router.get("/project/:projectId", getBiddingsByProject);
router.get("/count/:projectId", getBiddingCountByProject);

module.exports = router;
