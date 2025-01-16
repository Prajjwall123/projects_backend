const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '7c047a7d3dec647e73ef908c29f38e591ab2c0877b6933eb17f2e3fb0fe8af34';
const User = require('../model/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();


let otpStorage = {};

const register = async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const otp = crypto.randomInt(100000, 999999);

        otpStorage[email] = { otp, name, email, password, phone, role };

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: "Your OTP for Registration",
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #000;">
    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #000; border-radius: 10px; overflow: hidden;">
        <!-- Header with Logo -->
        <div style="background-color: #00008b; padding: 15px; text-align: center; color: #fff;">
            <img src="https://i.postimg.cc/gj8GFZHf/logo.png" alt="Company Logo" style="max-width: 150px; margin-bottom: 10px;" />
            <h1 style="margin: 0;">Your Registration OTP</h1>
        </div>
        <!-- Body -->
        <div style="padding: 20px;">
            <p style="font-size: 16px; line-height: 1.5; color: #000;">
                Dear <strong>${name}</strong>,
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #000;">
                Thank you for registering with us. Please use the one-time password (OTP) below to complete your registration process:
            </p>
            <div style="margin: 20px 0; text-align: center;">
                <span style="font-size: 24px; font-weight: bold; color: #00008b; padding: 10px 20px; border: 2px solid #00008b; border-radius: 5px; display: inline-block;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #000;">
                This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #000;">
                Regards,<br/>
                <strong>ProjectsYeti</strong>
            </p>
        </div>
        <!-- Footer -->
        <div style="background-color: #00008b; padding: 15px; text-align: center; color: #fff;">
            <p style="margin: 0; font-size: 14px; color: #f5f5dc;">
                If you have any questions, contact us at 
                <a href="mailto:${process.env.EMAIL_ADDRESS}" style="color: #f5f5dc;">${process.env.EMAIL_ADDRESS}</a>
            </p>
            <p style="margin: 0; font-size: 14px; color: #f5f5dc;">
                © ${new Date().getFullYear()} ProjectsYeti. All Rights Reserved.
            </p>
        </div>
    </div>
</div>

            `
        });


        res.status(200).json({ message: "OTP sent to your email", info });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const storedData = otpStorage[email];
        if (!storedData) {
            return res.status(400).send('Invalid or expired OTP');
        }

        if (storedData.otp.toString() === otp) {
            const hashedPassword = await bcrypt.hash(storedData.password, 10);
            const user = new User({
                name: storedData.name,
                email: storedData.email,
                password: hashedPassword,
                phone: storedData.phone,
                role: storedData.role
            });

            await user.save();

            delete otpStorage[email];

            res.status(201).json({ message: 'Registration successful', user });
        } else {
            res.status(400).send('Invalid OTP');
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
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
    login,
    verifyOtp
};

