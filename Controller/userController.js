const User = require("../model/User");

const getAll = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const { name, email, phone, password, role } = req.body;

        const newUser = new User({ name, email, phone, password, role });

        await newUser.save();
        console.log("User Saved:", newUser);

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error saving user:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "A user with your email or phone number already exists" });
        }
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getAll, create };
