import z, { ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

export const validateProduct = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Schema for form validation
	const productValidationSchema = z
		.object({
			product_name: z
				.string({
					required_error: "product_name is required",
				})
				.min(3, "product_name must be at least (3) characters"),
			product_description: z.string().optional(),
			product_price: z
				.number({
					required_error: "product_price is required",
					invalid_type_error: "product_price must be a number",
				})
				.min(0.0, "product_price must be at least 0.00")
				.nonnegative({
					message:
						"product_price must be greater than or equal to zero(0)",
				})
				.multipleOf(0.01, {
					message: "product_price must only be (2) decimal places",
				}),
			product_tag: z.string().array().optional(),
		})
		.required();
	try {
		//Parses the data to check if it is valid according to the validation schema
		productValidationSchema.parse(req.body);
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
