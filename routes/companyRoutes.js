const express = require("express");
const router = express.Router();
const companyController = require("../controller/companyController"); // Ensure the correct path to your controller

router.get("/", companyController.getAllCompanies);

router.post("/", companyController.createCompany);

router.get("/:id", companyController.getCompanyById);

module.exports = router;
