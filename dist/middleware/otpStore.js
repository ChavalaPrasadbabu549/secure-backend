"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.setOtp = void 0;
const otpStore = {};
const setOtp = (email, otp, data) => {
    otpStore[email] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
        data
    };
};
exports.setOtp = setOtp;
const verifyOtp = (email, enteredOtp) => {
    const record = otpStore[email];
    if (!record)
        return false;
    if (record.expiresAt < Date.now()) {
        delete otpStore[email];
        return false;
    }
    if (record.otp !== enteredOtp)
        return false;
    const data = record.data;
    delete otpStore[email];
    return data;
};
exports.verifyOtp = verifyOtp;
