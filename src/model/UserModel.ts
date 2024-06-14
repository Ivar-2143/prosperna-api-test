import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

//User Schema is where the variables of the Model is declared and their properties
const UserSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		salt: {
			type: String,
			required: true,
		},
		access_level: {
			type: Number,
		},
	},
	{ timestamps: true }
);

//Wraps the UserSchema with collection name of "User" to an Object Model specifically a Mongoose Object or also the Model class
const User = mongoose.model("User", UserSchema);

export const Authenticate = async (email: string, password: string) => {
	try {
		//finds the user by email
		const user = await User.findOne({ email });
		//throws an error if there are no users
		if (!user) throw new Error();
		//compare the password with the input password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		//throws an error if the password is not valid
		if (!isPasswordValid) throw new Error();
		//returns the user if the credentials are valid
		return user;
	} catch (e) {
		//returns null if the credentials are not valid
		return null;
	}
};

export default User;
