const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const OTP = require('../model/OTP');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Freelancer = require('../model/Freelancer');
const Company = require('../model/Company');

require('dotenv').config();

const register = async (req, res) => {
    const { email, password, role, companyName, companyBio, employees, skills, experienceYears, availability, portfolio } = req.body;
    const { logo, profileImage } = req.files;

    console.log('Uploaded files:', req.files);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const otp = crypto.randomInt(100000, 999999);
        const hashedPassword = await bcrypt.hash(password, 10);

        const otpData = {
            email,
            otp,
            password: hashedPassword,
            role,
            createdAt: Date.now(),
            attempts: 0
        };

        if (role === "company") {
            otpData.companyName = companyName || null;
            otpData.companyBio = companyBio || null;
            otpData.employees = employees || null;
            otpData.logo = logo[0] ? logo[0].path : null;
        } else if (role === "freelancer") {
            otpData.skills = skills || [];
            otpData.experienceYears = experienceYears || null;
            otpData.availability = availability || null;
            otpData.portfolio = portfolio || null;

            if (req.files && req.files.profileImage) {
                otpData.profileImage = req.files.profileImage[0] ? req.files.profileImage[0].path : null;
            } else {
                console.log('No profile image uploaded');
                otpData.profileImage = null;
            }
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        await OTP.create(otpData);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: "Your OTP for Registration",
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`
        });

        res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const storedData = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!storedData) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const user = new User({
            email: storedData.email,
            password: storedData.password,
            role: storedData.role
        });
        await user.save();

        if (storedData.role === "company") {
            const company = new Company({
                user: user._id,
                companyName: storedData.companyName,
                companyBio: storedData.companyBio,
                employees: storedData.employees,
                logo: storedData.logo,
                projectsPosted: storedData.projectsPosted,
                projectsAwarded: storedData.projectsAwarded,
                projectsCompleted: storedData.projectsCompleted
            });
            await company.save();
        } else if (storedData.role === "freelancer") {
            const freelancer = new Freelancer({
                user: user._id,
                skills: storedData.skills,
                experienceYears: storedData.experienceYears,
                availability: storedData.availability,
                portfolio: storedData.portfolio,
                profileImage: storedData.profileImage,
                projectsCompleted: 0
            });
            await freelancer.save();
        }

        await OTP.deleteOne({ _id: storedData._id });

        res.status(201).json({ message: "Registration successful", user });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal server error" });
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
            '7c047a7d3dec647e73ef908c29f38e591ab2c0877b6933eb17f2e3fb0fe8af34',
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
    login,
    verifyOtp,
};

