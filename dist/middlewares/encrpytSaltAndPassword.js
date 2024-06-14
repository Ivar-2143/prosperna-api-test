"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrpytSaltAndPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const encrpytSaltAndPassword = async (req, res, next) => {
    try {
        // Destructures the password to the body.
        const { password } = req.body;
        // Generates an encrypted salt and hashes the password after validation and before going to users register controller
        const salt = await bcrypt_1.default.genSalt();
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        //Attaches the generated salt and encrypted password to the request body
        req.body.salt = salt;
        req.body.password = hashedPassword;
        //proceeds to the next function or to the register function
        next();
    }
    catch (err) {
        //Unexpected Error
        res.status(500).send({
            message: "Internal Server Error",
            err,
        });
    }
};
exports.encrpytSaltAndPassword = encrpytSaltAndPassword;
