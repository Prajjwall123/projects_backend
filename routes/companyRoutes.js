const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../security/Auth")

const { getAllCompanies, createCompany, getCompanyById, updateCompany, deleteCompany } = require("../controller/companyController");

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


router.get("/", getAllCompanies);
router.post("/", upload.single('file'), createCompany);
router.get("/:id", getCompanyById);
router.put("/:id", authenticateToken, updateCompany);
router.delete("/:id", authenticateToken, deleteCompany);

module.exports = router;
