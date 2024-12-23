const Project = require("../model/Project");

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("companyID", "name companyBio");
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: error.message });
    }
};

const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id).populate("companyID", "name companyBio");
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const { title, category, requirements, description, postedDate, status, companyID } = req.body;

        const project = new Project({
            title,
            category,
            requirements,
            description,
            postedDate,
            status,
            companyID,
        });

        await project.save();
        console.log("Project Created:", project);
        res.status(201).json(project);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(400).json({ message: error.message });
    }
};

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
        console.error("Error updating project:", error);
        res.status(400).json({ message: error.message });
    }
};

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
        console.error("Error deleting project:", error);
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
