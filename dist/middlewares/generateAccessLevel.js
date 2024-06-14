"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessLevel = void 0;
const UserModel_1 = __importDefault(require("../model/UserModel"));
const generateAccessLevel = async (req, res, next) => {
    try {
        // Generates a random number betwwen 500 to 800 for regular users.
        let max = 800;
        let min = 500;
        let random = Math.floor(Math.random() * (max - min + 1) + min);
        let access_level = random;
        //Checks if there is at least one user in the database
        const user_exists = await UserModel_1.default.findOne();
        //If there are no users, the first user will have an access level between 905 and 900 for admin access
        if (!user_exists) {
            max = 905;
            min = 900;
            random = Math.floor(Math.random() * (max - min + 1) + min);
            access_level = random;
        }
        //Attaches the access_level to the request body
        req.body.access_level = access_level;
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
exports.generateAccessLevel = generateAccessLevel;