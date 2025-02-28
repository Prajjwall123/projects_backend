import Freelancer from "../model/Freelancer.js";
import User from "../model/User.js";


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
        // Fetch freelancer by ID and populate skills
        const freelancer = await Freelancer.findById(id)
            .populate("user")
            .populate("skills"); // Populate skills field with Skill entity

        if (!freelancer) {
            return res.status(404).json({ message: "Freelancer not found" });
        }

        // Formatting response to include the full skill entities instead of just IDs
        const formattedResponse = {
            ...freelancer.toObject(),
            userId: freelancer.user?._id || null,
            skills: freelancer.skills.map(skill => ({
                _id: skill._id,
                name: skill.name,
                // add any other skill fields if needed
            })),
        };

        // Remove user field from the response
        delete formattedResponse.user;

        // Send response with populated skills
        res.status(200).json(formattedResponse);
    } catch (error) {
        console.error("Error fetching freelancer:", error);
        res.status(500).json({ message: error.message });
    }
};

const getFreelancerByUserId = async (req, res) => {
    const { userId } = req.params; // Get userId from the request parameters
    try {
        // Fetch freelancer by userId and populate skills
        const freelancer = await Freelancer.findOne({ user: userId }) // Find freelancer by the userId reference
            .populate("user")
            .populate("skills"); // Populate skills field with Skill entity

        if (!freelancer) {
            return res.status(404).json({ message: "Freelancer not found" });
        }

        // Formatting response to include the full skill entities instead of just IDs
        const formattedResponse = {
            ...freelancer.toObject(),
            userId: freelancer.user?._id || null,
            skills: freelancer.skills.map(skill => ({
                _id: skill._id,
                name: skill.name,
                // add any other skill fields if needed
            })),
        };

        // Remove user field from the response
        delete formattedResponse.user;

        // Send response with populated skills
        res.status(200).json(formattedResponse);
    } catch (error) {
        console.error("Error fetching freelancer by userId:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateFreelancer = async (req, res) => {
    console.log("update freelancer hit");
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Freelancer ID is required" });
        }

        const {
            freelancerName,
            profession,
            location,
            aboutMe,
            workAt,
            availability,
            experienceYears,
            portfolio,
            profileImage,
            projectsCompleted,
            skills,
            languages,
            experience,
            certifications
        } = req.body;

        const updatedFreelancer = await Freelancer.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(freelancerName && { freelancerName }),
                    ...(profession && { profession }),
                    ...(location && { location }),
                    ...(aboutMe && { aboutMe }),
                    ...(workAt && { workAt }),
                    ...(availability && { availability }),
                    ...(experienceYears !== undefined && { experienceYears }),
                    ...(portfolio && { portfolio }),
                    ...(profileImage && { profileImage }),
                    ...(projectsCompleted !== undefined && { projectsCompleted }),
                    ...(skills && { skills }),
                    ...(languages && { languages }),
                    ...(experience && { experience }),
                    ...(certifications && { certifications }),
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedFreelancer) {
            return res.status(404).json({ message: "Freelancer not found" });
        }

        console.log("Freelancer Updated:", updatedFreelancer);
        res.status(200).json(updatedFreelancer);
    } catch (error) {
        console.error("Error updating freelancer:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export default updateFreelancer;


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

export { getAllFreelancers, getFreelancerById, updateFreelancer, deleteFreelancer, getFreelancerByUserId };

