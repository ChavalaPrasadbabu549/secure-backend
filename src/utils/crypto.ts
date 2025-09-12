import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.SECRET_KEY || "my-secret-key";

export const encrypt = (value: string) => {
    return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
};

export const decrypt = (cipher: string) => {
    return CryptoJS.AES.decrypt(cipher, SECRET_KEY).toString(CryptoJS.enc.Utf8);
};

export const hash = (text: string) => {
    return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
}
