import { Response, Request, NextFunction } from "express";
import { validateToken } from "../utils/jwt";

export const authenticationCheck = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		//Checks for autherization in the headers
		const authHeader = req.headers["authorization"];
		//Splits the authorization value into two [Bearer, token]
		const token = (authHeader && authHeader.split(" ")[1]) || "";
		//Validates the token and returns the decoded value
		const decodedToken = validateToken(token);
		//Throws an error if the token is invalid
		if (!token || !decodedToken) {
			throw new Error("Unauthorized");
		}
		//Attaches the payload id based on the logged-in user id to the req.body
		req.body.id = decodedToken.id;
		//proceeds to the next function
		next();
	} catch (err: any) {
		if (err.message == "Unauthorized") {
			//if no token is found
			return res
				.status(401)
				.send({ title: "Unauthorized", message: "Unauthorized" });
		}
		//Unexpected error
		return res.status(500).send({ title: "Internal Server Error", err });
	}
};
