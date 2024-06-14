import { Decimal128, ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

//The schema of Product just like the typeface or the interface in typescript
const ProductSchema = new Schema(
	{
		product_name: {
			type: String,
			required: true,
		},
		product_price: {
			type: Decimal128,
			required: true,
		},
		product_description: {
			type: String,
		},
		product_tag: {
			type: Array<string>,
		},
		seller: {
			type: ObjectId,
			required: true,
		},
	},
	{ timestamps: true }
);

//Wraps the ProductSchema with collection name of "User" to an Object Model specifically a Mongoose Object or also the Model Class
const Product = mongoose.model("Product", ProductSchema);

export default Product;
