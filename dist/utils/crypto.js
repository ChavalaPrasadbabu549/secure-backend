"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const SECRET_KEY = process.env.SECRET_KEY || "my-secret-key";
const encrypt = (value) => {
    return crypto_js_1.default.AES.encrypt(value, SECRET_KEY).toString();
};
exports.encrypt = encrypt;
const decrypt = (cipher) => {
    return crypto_js_1.default.AES.decrypt(cipher, SECRET_KEY).toString(crypto_js_1.default.enc.Utf8);
};
exports.decrypt = decrypt;
const hash = (text) => {
    return crypto_js_1.default.SHA256(text).toString(crypto_js_1.default.enc.Hex);
};
exports.hash = hash;
