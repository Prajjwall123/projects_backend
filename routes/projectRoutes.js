const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../security/Auth")

const { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getProjectsByCompany } = require("../controller/projectController");

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.get("company/:id", getProjectsByCompany);
router.post("/", authenticateToken, authorizeRole("company"), createProject);
router.put("/:id", authenticateToken, authorizeRole("company"), updateProject);
router.delete("/:id", authenticateToken, authorizeRole("company"), deleteProject);

module.exports = router;
