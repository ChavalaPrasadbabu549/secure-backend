import mongoose, { Schema, Document } from "mongoose";
import { encrypt, decrypt, hash } from "../utils/crypto";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    emailHash: string;
    decryptFields(): { name: string; email: string; password: string };
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        emailHash: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

// ensures emailHash exists before validation
userSchema.pre("validate", function (next) {
    if (this.email) {
        this.emailHash = hash(this.email);
    }
    next();
});

// encrypt fields before saving
userSchema.pre("save", function (next) {
    if (this.isModified("name") && this.name) {
        this.name = encrypt(this.name);
    }

    if (this.isModified("password") && this.password) {
        this.password = encrypt(this.password);
    }

    if (this.isModified("email") && this.email) {
        this.email = encrypt(this.email);
    }

    next();
});

// decrypt fields for API responses
userSchema.methods.decryptFields = function () {
    return {
        id:this._id,
        name: decrypt(this.name),
        email: decrypt(this.email),
        password: decrypt(this.password),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

export default mongoose.model<IUser>("User", userSchema);
