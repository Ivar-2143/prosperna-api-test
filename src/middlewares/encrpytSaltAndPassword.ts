import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

export const encrpytSaltAndPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Destructures the password to the body.
		const { password } = req.body;
		// Generates an encrypted salt and hashes the password after validation and before going to users register controller
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);
		//Attaches the generated salt and encrypted password to the request body
		req.body.salt = salt;
		req.body.password = hashedPassword;
		//proceeds to the next function or to the register function
		next();
	} catch (err) {
		//Unexpected Error
		res.status(500).send({
			message: "Internal Server Error",
			err,
		});
	}
};
