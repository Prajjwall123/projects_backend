const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '7c047a7d3dec647e73ef908c29f38e591ab2c0877b6933eb17f2e3fb0fe8af34';
const User = require('../model/User');

const register = async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        });

        await user.save();
        res.status(201).send({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).send('Invalid email or password');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = {
    register,
    login
};
