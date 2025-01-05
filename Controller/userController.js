const User = require("../model/User");
const { hashPassword, matchPassword } = require("../utils/hashPassword");
const generateToken = require("../utils/generateToken");


const getAll = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role
        });

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


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User Updated:", updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User Deleted:", deletedUser);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await matchPassword(password, user.password))) {
        res.json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};


module.exports = {
    getAll,
    getUserById,
    create,
    updateUser,
    deleteUser,
    loginUser,
};
