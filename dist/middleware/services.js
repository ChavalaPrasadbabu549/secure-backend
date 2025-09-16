"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sendotpmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Sendotpmail = async (to, otp) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            },
        });
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}`,
            html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
        });
        console.log("OTP Email sent:", info.messageId);
        return true;
    }
    catch (error) {
        console.error(" OTP email sending failed:", error);
        return false;
    }
};
exports.Sendotpmail = Sendotpmail;
