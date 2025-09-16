"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetuserId = exports.Updateuser = exports.Getall = exports.verifylogin = exports.login = exports.verifyregister = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const otpStore_1 = require("../middleware/otpStore");
const services_1 = require("../middleware/services");
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const crypto_2 = require("../utils/crypto");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "Validation error",
            });
        }
        const emailHash = (0, crypto_2.hash)(email);
        const userExist = await User_1.default.findOne({ emailHash });
        if (userExist) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "User already exists"
            });
        }
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        (0, otpStore_1.setOtp)(email, otp, { name, email, password });
        await (0, services_1.Sendotpmail)(email, otp);
        return res.status(200).json({
            success: true,
            code: 200,
            message: "OTP sent to your email. Please verify to complete registration.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error"
        });
    }
};
exports.register = register;
const verifyregister = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const userData = (0, otpStore_1.verifyOtp)(email, otp);
        if (!userData) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "Invalid or expired OTP",
            });
        }
        const user = new User_1.default(userData);
        await user.save();
        return res.status(201).json({
            success: true,
            code: 201,
            message: "Registration successful",
            data: user.decryptFields(),
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            code: 500,
            error,
            message: "Server error",
        });
    }
};
exports.verifyregister = verifyregister;
const login = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Email is required"
            });
        }
        const emailHash = (0, crypto_2.hash)(email);
        const user = await User_1.default.findOne({ emailHash });
        if (!user)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        (0, otpStore_1.setOtp)(email, otp, { userId: user._id });
        await (0, services_1.Sendotpmail)(email, otp);
        return res.status(200).json({
            success: true,
            message: "OTP sent to your email. Verify to login."
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Server error"
        });
    }
};
exports.login = login;
const verifylogin = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const data = (0, otpStore_1.verifyOtp)(email, otp);
        if (!data) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        const user = await User_1.default.findById(data.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const token = (0, generateToken_1.default)(user.id.toString());
        const decryptedUser = user.decryptFields();
        return res.status(200).json({
            success: true,
            code: 200,
            message: "Login successfully",
            data: {
                name: decryptedUser.name,
                token
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Server error"
        });
    }
};
exports.verifylogin = verifylogin;
const Getall = async (req, res) => {
    try {
        const users = await User_1.default.find().sort({ createdAt: -1 }).select("-password");
        const decryptedUsers = users.map(user => user.decryptFields());
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Users fetched successfully",
            data: decryptedUsers
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Server error"
        });
    }
};
exports.Getall = Getall;
const Updateuser = async (req, res) => {
    const { userId } = req.params;
    const { name, email, password } = req.body;
    try {
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "User not found"
            });
        }
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (password)
            user.password = password;
        await user.save();
        const decryptedUser = user.decryptFields();
        return res.status(200).json({
            success: true,
            code: 200,
            message: "User updated successfully",
            data: decryptedUser
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error"
        });
    }
};
exports.Updateuser = Updateuser;
const GetuserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "user Id is Required"
            });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(409).json({
                success: false,
                code: 409,
                message: "user not found"
            });
        }
        const decryptedUser = user.decryptFields();
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Users fetched successfully",
            data: decryptedUser
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error"
        });
    }
};
exports.GetuserId = GetuserId;
