import { Request, Response } from "express";
import User from "../model/UserModel";

export default class UsersController {
	//Path = "/users";
	async index(req: Request, res: Response) {
		// res.send("List of users");
		const userList = await User.find();
		return res
			.status(200)
			.send({ title: "List of Users", users: userList });
	}
	//Path - /users/register
	async register(req: Request, res: Response) {
		//Destructures the req.body
		const { email, password, salt, access_level } = req.body;
		//Creates a new user with email,password, and salt
		const user = new User({ email, password, salt, access_level });
		try {
			//Saves the user to the mongoDB
			let response = await user.save();
			//Sends a successful register response
			return res.send({
				message: "Successfully Registered",
				details: response,
			});
		} catch (err: any) {
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
	async update(req: Request, res: Response) {
		const { id, email, password, salt } = req.body;
		const editing_id = req.params.id;
		try {
			//throws an error if the id of the user is not matching the id of the account he is editing
			if (id != editing_id) throw new Error("NotAllowed");
			const user = await User.findByIdAndUpdate(id, {
				email,
				password,
				salt,
			});
			if (!user) throw new Error("NotFound");
			let updated_user = await User.findById(id);
			return res.status(200).send({
				message: "Updated Successfully",
				user: updated_user,
			});
		} catch (e: any) {
			if (e.message == "NotAllowed") {
				return res.status(403).send({
					title: "Forbidden",
					message: "You are not allowed to update this account",
				});
			}
			return res.status(500).send({ title: "Internal Server Error" });
		}
	}
	async getUser(req: Request, res: Response) {
		const { id } = req.params;
		try {
			const user = await User.findById(id);
			//throws an error if user does not exist
			if (!user) throw new Error("Not Found");
			//if user is existing, returns the fetched user
			return res.status(200).send({ title: "User", user });
		} catch (e: any) {
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
	async delete(req: Request, res: Response) {
		const current_user = req.body.id;
		const { id } = req.params;
		try {
			if (id != current_user) throw new Error("NotAllowed");
			const user = await User.findByIdAndDelete(id);
			if (!user) throw new Error("NotFound");
			res.send({ message: "Deleted Successfully", user });
		} catch (e: any) {
			if (e.message == "NotAllowed") {
				return res.status(403).send({
					title: "Forbidden",
					message: "You are not allowed to delete this account",
				});
			} else if (e.message == "NotFound") {
				return res.status(404).send({
					title: "Not Found",
					message: "User not found",
				});
			} else {
				//Unexpected error
				return res.status(500).send({
					title: "Internal Server Error",
					message: "Something went wrong",
				});
			}
		}
	}
}
