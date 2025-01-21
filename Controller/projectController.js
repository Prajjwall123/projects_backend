const Project = require("../model/Project");

const fs = require("fs");
const path = require("path");

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("company", "name logo")
            .exec();

        const updatedProjects = projects.map(project => {
            const logoPath = path.join(__dirname, "..", "images", project.company.logo);
            const logoBuffer = fs.readFileSync(logoPath);
            const logoBase64 = logoBuffer.toString("base64");

            project.company.logo = `data:image/png;base64,${logoBase64}`;
            return project;
        });

        res.status(200).json(updatedProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: error.message });
    }
};


const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id).populate("company", "name logo");
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const logoPath = path.join(__dirname, "..", "images", project.company.logo);
        const logoBuffer = fs.readFileSync(logoPath);
        const logoBase64 = logoBuffer.toString("base64");

        project.company.logo = `data:image/png;base64,${logoBase64}`;
        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ message: error.message });
    }
};



const createProject = async (req, res) => {
    try {
        const { title, category, requirements, description, status, company, duration } = req.body;

        if (!company) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        const project = new Project({
            title,
            category,
            requirements,
            description,
            status,
            company,
            duration,
        });

        await project.save();
        console.log("Project Created:", project);
        res.status(201).json(project);
    } catch (error) {
        console.error("Error while creating project:", error);
        res.status(400).json({ message: error.message });
    }
};


// Update an existing project
const updateProject = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const project = await Project.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        console.log("Project Updated:", project);
        res.status(200).json(project);
    } catch (error) {
        console.error("Error while updating project:", error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a project
const deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        console.log("Project Deleted:", project);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error while deleting project:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};
