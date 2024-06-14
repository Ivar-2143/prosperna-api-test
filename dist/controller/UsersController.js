"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../model/UserModel"));
class UsersController {
    //Path = "/users";
    async index(req, res) {
        // res.send("List of users");
        const userList = await UserModel_1.default.find();
        return res
            .status(200)
            .send({ title: "List of Users", users: userList });
    }
    //Path - /users/register
    async register(req, res) {
        //Destructures the req.body
        const { email, password, salt, access_level } = req.body;
        //Creates a new user with email,password, and salt
        const user = new UserModel_1.default({ email, password, salt, access_level });
        try {
            //Saves the user to the mongoDB
            let response = await user.save();
            //Sends a successful register response
            return res.send({
                message: "Successfully Registered",
                details: response,
            });
        }
        catch (err) {
            //Captures a MongoDB Error and sends it if email already exists
            if (err.code == 11000) {
                //Captures a MongoDB Error and sends it if email already exists
                return res
                    .status(400)
                    .send({ errors: { email: "Email is already used." }, err });
            }
            //Unexpected error
            return res.status(500).send({
                message: "Internal Server Error",
                err,
            });
        }
    }
    async update(req, res) {
        const { id, email, password, salt } = req.body;
        const editing_id = req.params.id;
        try {
            //throws an error if the id of the user is not matching the id of the account he is editing
            if (id != editing_id)
                throw new Error("NotAllowed");
            const user = await UserModel_1.default.findByIdAndUpdate(id, {
                email,
                password,
                salt,
            });
            if (!user)
                throw new Error("NotFound");
            let updated_user = await UserModel_1.default.findById(id);
            return res.status(200).send({
                message: "Updated Successfully",
                user: updated_user,
            });
        }
        catch (e) {
            if (e.message == "NotAllowed") {
                return res.status(403).send({
                    title: "Forbidden",
                    message: "You are not allowed to update this account",
                });
            }
            return res.status(500).send({ title: "Internal Server Error" });
        }
    }
    async getUser(req, res) {
        const { id } = req.params;
        try {
            const user = await UserModel_1.default.findById(id);
            //throws an error if user does not exist
            if (!user)
                throw new Error("Not Found");
            //if user is existing, returns the fetched user
            return res.status(200).send({ title: "User", user });
        }
        catch (e) {
            if (e.message == "Not Found") {
                return res
                    .status(404)
                    .send({ title: "Not Found", message: "User not found" });
            }
            return res.status(500).send({
                title: "Internal Server Error",
                message: "Something went wrong",
            });
        }
    }
    async delete(req, res) {
        const current_user = req.body.id;
        const { id } = req.params;
        try {
            if (id != current_user)
                throw new Error("NotAllowed");
            const user = await UserModel_1.default.findByIdAndDelete(id);
            if (!user)
                throw new Error("NotFound");
            res.send({ message: "Deleted Successfully", user });
        }
        catch (e) {
            if (e.message == "NotAllowed") {
                return res.status(403).send({
                    title: "Forbidden",
                    message: "You are not allowed to delete this account",
                });
            }
            else if (e.message == "NotFound") {
                return res.status(404).send({
                    title: "Not Found",
                    message: "User not found",
                });
            }
            else {
                //Unexpected error
                return res.status(500).send({
                    title: "Internal Server Error",
                    message: "Something went wrong",
                });
            }
        }
    }
}
exports.default = UsersController;
