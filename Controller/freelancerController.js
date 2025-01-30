const Freelancer = require("../model/Freelancer");
const User = require("../model/User");

const getAllFreelancers = async (req, res) => {
    try {
        const freelancers = await Freelancer.find().populate("user", "name email role");
        res.status(200).json(freelancers);
    } catch (error) {
        console.error("Error fetching freelancers:", error);
        res.status(500).json({ message: error.message });
    }
};

const getFreelancerById = async (req, res) => {
    const { id } = req.params;
    try {
        const freelancer = await Freelancer.findById(id).populate("user", "name email role");
        if (!freelancer) {
            return res.status(404).json({ message: "Freelancer not found" });
        }
        res.status(200).json(freelancer);
    } catch (error) {
        console.error("Error fetching freelancer:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateFreelancer = async (req, res) => {
    const { id } = req.params;
    const { skills, experienceYears, profileImage, availability, profileImagePath } = req.body;
    try {
        const freelancer = await Freelancer.findById(id);
        if (!freelancer) {
            return res.status(404).json({ message: "Freelancer not found" });
        }

        freelancer.skills = skills || freelancer.skills;
        freelancer.experienceYears = experienceYears || freelancer.experienceYears;
        freelancer.profileImage = profileImage || freelancer.profileImage;
        freelancer.availability = availability || freelancer.availability;
        freelancer.profileImagePath = profileImagePath || freelancer.profileImagePath;

        await freelancer.save();
        console.log("Freelancer Updated:", freelancer);

        res.status(200).json(freelancer);
    } catch (error) {
        console.error("Error updating freelancer:", error);
        res.status(400).json({ message: error.message });
    }
};

const deleteFreelancer = async (req, res) => {
    const { id } = req.params;
    try {
        const freelancer = await Freelancer.findById(id);
        if (!freelancer) {
            return res.status(404).json({ message: "Freelancer not found" });
        }

        await freelancer.remove();
        console.log("Freelancer Deleted:", freelancer);

        res.status(200).json({ message: "Freelancer deleted successfully" });
    } catch (error) {
        console.error("Error deleting freelancer:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllFreelancers,
    getFreelancerById,
    updateFreelancer,
    deleteFreelancer
};
