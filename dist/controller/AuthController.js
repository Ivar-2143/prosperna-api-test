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
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importStar(require("../model/UserModel"));
const jwt_1 = require("../utils/jwt");
class AuthController {
    async index(req, res) {
        try {
            //destructures the id from the req.body attched by the middleware
            const { id } = req.body;
            //finds the user with the id from the token payload
            const user = await UserModel_1.default.findById(id);
            //throws an error if user does not exist
            if (!user)
                throw new Error("NotFound");
            //returns the user id and email only, password and other information is not included.
            res.status(200).send({
                user: { _id: user._id, email: user.email },
            });
        }
        catch (err) {
            //if the user is not found, returns a 404 error
            if (err.message == "NotFound") {
                return res.status(404).send({
                    title: "Not Found",
                    message: "User not found",
                });
            }
            //Unexpected error
            return res
                .status(500)
                .send({ title: " Internal Server Error", err });
        }
    }
    async validate(req, res) {
        //destructures the email and password from the req.body
        const { email, password } = req.body;
        try {
            //authenticates the user, return null if invalid
            const user = await (0, UserModel_1.Authenticate)(email, password);
            //throws an error if the user is invalid/null
            if (!user)
                throw new Error("Invalid Credentials");
            //creates a token with the user id if the user is valid
            const token = (0, jwt_1.createToken)(user._id);
            //returns a login success message and the token
            return res
                .status(200)
                .send({ message: "Login Successfully", token });
        }
        catch (err) {
            if (err.message == "Invalid Credentials") {
                //returns 401 Unauthorized if the credentials are invalid
                return res.status(401).send({
                    title: "Invalid Credentials",
                    message: "Email or password is incorrect",
                });
            }
            //Unexpected error
            return res.status(500).send({
                title: "Internal Server Error",
                err,
            });
        }
    }
}
exports.default = AuthController;
