const Skill = require("../model/Skill");

const createSkill = async (req, res) => {
    const { name } = req.body;

    try {
        const existingSkill = await Skill.findOne({ name });
        if (existingSkill) {
            return res.status(400).json({ message: "Skill already exists" });
        }

        const newSkill = new Skill({ name });
        await newSkill.save();

        res.status(201).json({
            message: "Skill created successfully",
            skill: newSkill,
        });
    } catch (error) {
        console.error("Error creating skill:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find().sort({ name: 1 });
        res.status(200).json(skills);
    } catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getSkillById = async (req, res) => {
    const { skillId } = req.params;

    try {
        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        res.status(200).json(skill);
    } catch (error) {
        console.error("Error fetching skill:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateSkill = async (req, res) => {
    const { skillId } = req.params;
    const { name } = req.body;

    try {
        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        skill.name = name || skill.name;
        await skill.save();

        res.status(200).json({
            message: "Skill updated successfully",
            skill,
        });
    } catch (error) {
        console.error("Error updating skill:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteSkill = async (req, res) => {
    const { skillId } = req.params;

    try {
        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        // Delete the skill
        await skill.remove();

        res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error) {
        console.error("Error deleting skill:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill,
};
