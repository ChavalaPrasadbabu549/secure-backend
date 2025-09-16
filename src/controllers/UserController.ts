import { Response, Request } from "express";
import User from "../models/User";
import crypto from "crypto";
import { setOtp, verifyOtp } from "../middleware/otpStore";
import { Sendotpmail } from "../middleware/services";
import generateToken from "../utils/generateToken";
import { hash } from "../utils/crypto";


export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "Validation error",
            })
        }
        const emailHash = hash(email);
        const userExist = await User.findOne({ emailHash });

        if (userExist) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "User already exists"
            })
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        setOtp(email, otp, { name, email, password });
        await Sendotpmail(email, otp);

        return res.status(200).json({
            success: true,
            code: 200,
            message: "OTP sent to your email. Please verify to complete registration.",
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error"
        })
    }
}

export const verifyregister = async (req: Request, res: Response) => {
    const { email, otp } = req.body
    try {
        const userData = verifyOtp(email, otp);
        if (!userData) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "Invalid or expired OTP",
            })
        }

        const user = new User(userData);
        await user.save();

        return res.status(201).json({
            success: true,
            code: 201,
            message: "Registration successful",
            data: user.decryptFields(),
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            code: 500,
            error,
            message: "Server error",
        });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email } = req.body
    try {

        if (!email) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Email is required"
            });
        }
        const emailHash = hash(email);
        const user = await User.findOne({ emailHash });
        if (!user)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        const otp = crypto.randomInt(100000, 999999).toString();
        setOtp(email, otp, { userId: user._id });
        await Sendotpmail(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email. Verify to login."
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Server error"
        })
    }
}

export const verifylogin = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    try {
        const data = verifyOtp(email, otp);
        if (!data) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        const user = await User.findById(data.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const token = generateToken(user.id.toString());
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
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Server error"
        })
    }
}

export const Getall = async (req: Request, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).select("-password");
        const decryptedUsers = users.map(user => user.decryptFields());

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Users fetched successfully",
            data: decryptedUsers
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Server error"
        })
    }

}

export const Updateuser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, email, password } = req.body
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "User not found"
            })
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();
        const decryptedUser = user.decryptFields();
        return res.status(200).json({
            success: true,
            code: 200,
            message: "User updated successfully",
            data: decryptedUser
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error"
        })
    }
}

export const GetuserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "user Id is Required"
            })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(409).json({
                success: false,
                code: 409,
                message: "user not found"
            })
        }
        const decryptedUser = user.decryptFields()
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Users fetched successfully",
            data: decryptedUser
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error"
        })
    }
}

