const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    attempts: { type: Number, default: 0 }
});

module.exports = mongoose.model('OTP', otpSchema);
