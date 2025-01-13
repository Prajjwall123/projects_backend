const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../security/Auth")

const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require("../controller/projectController");

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", authenticateToken, createProject);
router.put("/:id", authenticateToken, updateProject);
router.delete("/:id", authenticateToken, deleteProject);

module.exports = router;
