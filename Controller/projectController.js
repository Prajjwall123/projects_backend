const Project = require("../model/Project");

const fs = require("fs");
const path = require("path");
const Company = require("../model/Company");
const Bidding = require("../model/Bidding");
const Notification = require("../model/Notification");

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ status: "posted" })
            .populate("company", "companyName logo headquarters")
            .populate("category", "name")
            .exec();

        const response = await Promise.all(
            projects.map(async (project) => {
                const bidCount = await Bidding.countDocuments({ project: project._id });

                return {
                    projectId: project._id,
                    title: project.title,
                    companyId: project.company?._id || null,
                    companyName: project.company?.companyName || null,
                    companyLogo: project.company?.logo || null,
                    headquarters: project.company?.headquarters || null,
                    category: project.category.map((skill) => (skill ? skill.name : null)),
                    requirements: project.requirements,
                    description: project.description,
                    duration: project.duration,
                    postedDate: project.postedDate,
                    status: project.status,
                    bidCount: bidCount,
                };
            })
        );

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
            .populate("company", "companyName logo headquarters")
            .populate("category", "name");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const bidCount = await Bidding.countDocuments({ project: project._id });

        const response = {
            projectId: project._id,
            title: project.title,
            companyId: project.company._id,
            companyName: project.company.companyName,
            companyLogo: project.company.logo,
            headquarters: project.company.headquarters,
            category: project.category.map(skill => skill.name),
            requirements: String(project.requirements),
            description: project.description,
            duration: project.duration,
            postedDate: project.postedDate,
            status: project.status,
            bidCount,
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


const updateProject = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const project = await Project.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        console.log("Project Updated:", project);

        // If project is awarded, notify freelancer & delete previous biddings
        if (updates.status === "awarded" && updates.awardedTo) {
            const notification = new Notification({
                recipient: updates.awardedTo,
                recipientType: "Freelancer",
                message: `Congratulations! You have been awarded the project: "${project.title}".`,
            });

            await notification.save();
            console.log("Notification sent to Freelancer:", notification);

            const deletedBiddings = await Bidding.deleteMany({ project: id });
            console.log(`Deleted ${deletedBiddings.deletedCount} biddings for project: ${id}`);
        }

        if (["Feedback Requested", "Done"].includes(updates.status)) {
            const notification = new Notification({
                recipient: project.company,
                recipientType: "Company",
                message: `Project status updated for "${project.title}".`,
            });

            await notification.save();
            console.log("Notification sent to Company:", notification);
        }

        if (updates.feedbackRespondMessage) {
            const notification = new Notification({
                recipient: project.awardedTo,
                recipientType: "Freelancer",
                message: `Feedback received on project: "${project.title}".`,
            });

            await notification.save();
            console.log("Notification sent to Freelancer:", notification);
        }

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


const getProjectsByFreelancerId = async (req, res) => {
    try {
        const { freelancerId } = req.params;

        if (!freelancerId) {
            return res.status(400).json({ message: "Freelancer ID is required" });
        }

        // Fetch projects where freelancer was awarded
        const projects = await Project.find({ status: { $ne: "posted" }, awardedTo: freelancerId })
            .populate("company", "companyName logo headquarters")
            .populate("category", "name")
            .exec();

        // Process project data
        const response = await Promise.all(
            projects.map(async (project) => {
                const bidCount = await Bidding.countDocuments({ project: project._id });

                return {
                    projectId: project._id,
                    title: project.title,
                    companyId: project.company?._id || null,
                    companyName: project.company?.companyName || null,
                    companyLogo: project.company?.logo || null,
                    headquarters: project.company?.headquarters || null,
                    category: project.category.map((skill) => (skill ? skill.name : null)),
                    requirements: project.requirements,
                    description: project.description,
                    duration: project.duration,
                    postedDate: project.postedDate,
                    status: project.status,
                    bidCount: bidCount,
                    feedbackRequestedMessage: project.feedbackRequestedMessage || "",
                    link: project.link || "",
                    feedbackRespondMessage: project.feedbackRespondMessage || "",
                };
            })
        );

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching freelancer's projects:", error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByCompany,
    getProjectsByFreelancerId
};
