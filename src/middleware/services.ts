import nodemailer from "nodemailer";


export const Sendotpmail = async (to: string, otp: string) => {
    try {
        const transporter = nodemailer.createTransport({
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
    } catch (error: any) {
        console.error(" OTP email sending failed:", error);
        return false;
    }
}