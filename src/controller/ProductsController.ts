import { Request, Response } from "express";
import Product from "../model/ProductModel";

export default class ProductsController {
	//Finds all the products and returns it.
	async index(req: Request, res: Response) {
		const products = await Product.find();
		return res.status(200).send({ title: "List of products", products });
	}

	//getProduct is the controller for fetching a single product
	async getProduct(req: Request, res: Response) {
		//extracts the id in the params
		const { id } = req.params;
		//finds the product with that id
		const product = await Product.findById(id);
		//if there are no products, it throws an 404 status code error
		if (!product)
			return res.status(404).send({ message: "Product not found" });
		//if the product is existing, it returns the product
		return res.status(200).send({ product });
	}
	async create(req: Request, res: Response) {
		//extracts the values in the request body, including the "id" of the authenticated user.
		const {
			id,
			product_name,
			product_description,
			product_price,
			product_tag,
		} = req.body;
		//creates a new product
		let product = new Product({
			product_name,
			product_description,
			product_price,
			product_tag,
			seller: id,
		});
		try {
			//saves the product to the database
			await product.save();
			//returns success if successful.
			return res
				.status(200)
				.send({ message: "Product added successfully", product });
		} catch (err) {
			//Handles unexpected errors.
			return res.status(500).send({
				message: "Internal Server Error",
				err,
			});
		}
	}
	//Controller for the update product request
	async update(req: Request, res: Response) {
		//the current_user is based on the authenticated user attached to the req.body
		const current_user = req.body.id;
		//the id of the product to update
		const product_id = req.params.id;
		//the new value of the product
		const {
			product_name,
			product_description,
			product_price,
			product_tag,
		} = req.body;
		try {
			//tries to find the product
			const product = await Product.findById(product_id);
			//throws an error if the product is not found
			if (!product) throw new Error("NotFound");
			//throws an error if the owner of the product is not the current user. Technically they are not allowed to update the product.
			if (current_user != product.seller) throw new Error("NotAllowed");
			//overwrites the old product values with the new values.
			product.overwrite({
				product_name,
				product_price,
				product_description,
				product_tag,
				seller: current_user,
			});
			//saves the updated product to the database
			let updated_product = await product.save();
			//returns the updated product with the status of 200(ok)
			return res.status(200).send({
				message: "Updated Successfully",
				product: updated_product,
			});
		} catch (err: any) {
			if (err.message == "NotFound") {
				//returns an error 404 if the product is not found
				return res.status(404).send({
					title: "NotFound",
					message: "Product Not Found",
				});
			} else if (err.message == "NotAllowed") {
				//returns an error 403(Forbidden) if the user is not the owner of the product
				return res.status(403).send({
					title: "Forbidden",
					message: "You are not allowed to edit this product.",
				});
			} else {
				//Handles the unexpected error
				return res
					.status(500)
					.send({ title: "Internal Server Error", err });
			}
		}
	}
	async delete(req: Request, res: Response) {
		const product_id = req.params.id;
		const current_user = req.body.id;
		try {
			const product = await Product.findById(product_id);
			if (!product) throw new Error("NotFound");
			if (current_user != product.seller) throw new Error("NotAllowed");
			const deleted = await product.deleteOne();
			if (!deleted.acknowledged) throw new Error("DeletionFailed");
			res.status(200).send({
				title: "Deleted Successfully",
				product,
			});
		} catch (err: any) {
			if (err.message == "NotAllowed") {
				res.status(403).send({
					title: "Forbidden",
					message: "You are not allowed to delete this product.",
				});
			} else if (err.message == "NotFound") {
				res.status(404).send({
					title: "NotFound",
					message: "Product Not Found",
				});
			} else {
				res.status(500).send({
					title: "Internal Server Error",
					err,
				});
			}
		}
	}
}
