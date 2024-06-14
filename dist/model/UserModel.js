"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//User Schema is where the variables of the Model is declared and their properties
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    access_level: {
        type: Number,
    },
}, { timestamps: true });
//Wraps the UserSchema with collection name of "User" to an Object Model specifically a Mongoose Object or also the Model class
const User = mongoose_1.default.model("User", UserSchema);
const Authenticate = async (email, password) => {
    try {
        //finds the user by email
        const user = await User.findOne({ email });
        //throws an error if there are no users
        if (!user)
            throw new Error();
        //compare the password with the input password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        //throws an error if the password is not valid
        if (!isPasswordValid)
            throw new Error();
        //returns the user if the credentials are valid
        return user;
    }
    catch (e) {
        //returns null if the credentials are not valid
        return null;
    }
};
exports.Authenticate = Authenticate;
exports.default = User;
