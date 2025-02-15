const Project = require("../model/Project");

const fs = require("fs");
const path = require("path");
const Company = require("../model/Company");

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("company", "companyName logo")
            .populate("category", "name")
            .exec();

        const response = projects.map(project => ({
            projectId: project._id,
            title: project.title,
            companyId: project.company?._id || null,
            companyName: project.company?.companyName || null,
            companyLogo: project.company?.logo || null,
            category: project.category.map(skill => skill ? skill.name : null),
            requirements: project.requirements,
            description: project.description,
            duration: project.duration,
            postedDate: project.postedDate,
            status: project.status,
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: error.message });
    }
};


const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id)
            .populate("company", "companyName logo")
            .populate("category", "name");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const response = {
            projectId: project._id,
            title: project.title,
            companyId: project.company._id,
            companyName: project.company.companyName,
            companyLogo: project.company.logo,
            category: project.category.map(skill => skill.name),
            requirements: String(project.requirements),
            description: project.description,
            duration: project.duration,
            postedDate: project.postedDate,
            status: project.status,
        };

        res.status(200).json(response);
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

        // Increment the projectsPosted field in the company document
        const updatedCompany = await Company.findByIdAndUpdate(
            company,
            { $inc: { projectsPosted: 1 } },
            { new: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        console.log("Company Updated:", updatedCompany);
        res.status(201).json(project);
    } catch (error) {
        console.error("Error while creating project:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const getProjectsByCompany = async (req, res) => {
    try {
        const { id: companyId } = req.params;

        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        const projects = await Project.find({ company: companyId })
            .populate("category")
            .populate("company", "companyName logo");

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: "No projects found for this company" });
        }

        res.status(200).json(projects);
    } catch (error) {
        console.error("Error while fetching projects by company:", error);
        res.status(500).json({ message: "Internal Server Error" });
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

        const updatedCompany = await Company.findByIdAndUpdate(
            project.company,
            { $inc: { projectsPosted: -1 } },
            { new: true }
        );

        if (!updatedCompany) {
            console.warn("Company not found while updating projectsPosted");
        } else {
            console.log("Company Updated:", updatedCompany);
        }

        console.log("Project Deleted:", project);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error while deleting project:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByCompany
};
