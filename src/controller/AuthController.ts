import { Request, Response } from "express";
import User, { Authenticate } from "../model/UserModel";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwt";

export default class AuthController {
	async index(req: Request, res: Response) {
		try {
			//destructures the id from the req.body attched by the middleware
			const { id } = req.body;
			//finds the user with the id from the token payload
			const user = await User.findById(id);
			//throws an error if user does not exist
			if (!user) throw new Error("NotFound");
			//returns the user id and email only, password and other information is not included.
			res.status(200).send({
				user: { _id: user._id, email: user.email },
			});
		} catch (err: any) {
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
	async validate(req: Request, res: Response) {
		//destructures the email and password from the req.body
		const { email, password } = req.body;
		try {
			//authenticates the user, return null if invalid
			const user = await Authenticate(email, password);
			//throws an error if the user is invalid/null
			if (!user) throw new Error("Invalid Credentials");
			//creates a token with the user id if the user is valid
			const token = createToken(user._id);
			//returns a login success message and the token
			return res
				.status(200)
				.send({ message: "Login Successfully", token });
		} catch (err: any) {
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
