const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../security/Auth")

const { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getProjectsByCompany, getProjectsByFreelancerId, getFilteredProjects } = require("../controller/projectController");

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.get("/category/:categoryId", getFilteredProjects);
router.get("/freelancer/:freelancerId", getProjectsByFreelancerId);
router.get("/getByCompany/:id", getProjectsByCompany);
router.post("/", authenticateToken, authorizeRole("company"), createProject);
router.put("/:id", authenticateToken, updateProject);
router.delete("/:id", authenticateToken, authorizeRole("company"), deleteProject);

module.exports = router;
