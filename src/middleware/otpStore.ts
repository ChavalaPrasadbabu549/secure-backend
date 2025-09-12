const otpStore: Record<string, { otp: string; expiresAt: number; data: any }> = {};

export const setOtp = (email: string, otp: string, data: any) => {
    otpStore[email] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
        data
    };
};

export const verifyOtp = (email: string, enteredOtp: string) => {
    const record = otpStore[email];
    if (!record) return false;
    if (record.expiresAt < Date.now()) {
        delete otpStore[email];
        return false;
    }
    if (record.otp !== enteredOtp) return false;

    const data = record.data;
    delete otpStore[email];
    return data;
};
