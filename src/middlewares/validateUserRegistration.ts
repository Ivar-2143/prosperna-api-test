import z, { ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

export const validateUserRegistration = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Schema for form validation
	const userValidationSchema = z
		.object({
			email: z.string().email(),
			password: z.string().min(8),
			password_confirmation: z.string(),
		})
		.required()
		.refine((data) => data.password === data.password_confirmation, {
			message: "Password does not match",
			path: ["password_confirmation"],
		});
	try {
		//Parses the data to check if it is valid according to the validation schema
		userValidationSchema.parse(req.body);
		//If the data is valid, proceeds to the next function or to the register function
		next();
	} catch (err) {
		if (err instanceof ZodError) {
			let errors = {};
			//maps the list of errors if there are multiple errors
			err.issues.map((err) => {
				errors = { ...errors, [err.path[0]]: err.message };
			});
			//sends the errors for invalid data
			return res.status(400).send({ errors: errors });
		}
		//Unexpected error
		return res.status(500).send({ message: "Internal Server Error", err });
	}
};
