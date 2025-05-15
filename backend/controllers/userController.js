const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, UserLog } = require("../models");
const nodemailer = require("nodemailer");
const { validateUserInput } = require("./utils/validators");

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "30m",
    });
};

// Email sender configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper function to send OTP via email
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "PlagiQ - Email Verification for Signup",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Welcome to PlagiQ!</h2>
                <p>Thank you for signing up. Please use the following OTP to verify your account:</p>
                <h3 style="color: #4CAF50;">${otp}</h3>
                <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <br>
                <p>Best regards,</p>
                <p>Plagiarism Checker Team</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw new Error("Error sending OTP email");
    }
};

// Generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP temporarily
const otpStore = {};

// Forgot Password (Send OTP)
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "Email not found." });

        const otp = generateOTP();
        otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 minutes expiration
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: "OTP sent to your email for password reset." });
    } catch (err) {
        res.status(500).json({ message: "Error sending OTP", error: err.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const errors = [];

    // Input validation
    if (!email) errors.push("Email is required.");
    if (!otp) errors.push("OTP is required.");
    if (!newPassword) errors.push("New password is required.");
    else if (newPassword.length < 6 || !/\d/.test(newPassword)) {
        errors.push("Password must be at least 6 characters long and contain at least one number.");
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "No user found with the provided email." });

        const storedOtp = otpStore[email];
        if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        // Hash the new password securely
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { email } });
        delete otpStore[email];

        res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate email
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    // Validate password
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    try {
        const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
        if (!user) return res.status(400).json({ message: "We couldn’t find your account, try signing up!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        if (user.role !== 'admin') {
            await UserLog.create({
                userId: user.id,
                action: 'login',
                metadata: {},
                createdAt: new Date(), // use camelCase since your model uses that
            });
        }
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 30 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Validation checks
    if (!username) return res.status(400).json({ message: "Username is required" });
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    // Validate user input
    const errors = validateUserInput(username, email, password);
    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }

    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const otp = generateOTP();
        otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // 10 minutes expiration
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: "OTP sent to email for verification." });
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
    }
};

// Verify OTP and save user
const verifyOTP = async (req, res) => {
    const { username, email, password, otp } = req.body;

    const storedOtp = otpStore[email];
    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });

        delete otpStore[email];
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error saving user", error });
        console.log("Error saving user:", error);
    }
};

// Logout user
const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.json({ message: "Logout successful" });
};

// Check Authentication
const checkAuth = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ authenticated: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, username, email, role } = decoded;

        res.json({
            authenticated: true,
            user: { id, username, email, role },
        });
    } catch (err) {
        console.error("Invalid token:", err);
        res.status(401).json({ authenticated: false });
    }
};

module.exports = {
    registerUser,
    verifyOTP,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    checkAuth,
};
