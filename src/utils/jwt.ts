import { ObjectId } from "mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";

const secret = "JESUSlovesyou247!";

export const createToken = (id: ObjectId) => {
	return jwt.sign({ id }, secret, { expiresIn: "1h" });
};

export const validateToken = (token: string): null | JwtPayload => {
	let decodedToken = null;
	jwt.verify(token, secret, (err, value) => {
		if (err) return null;
		decodedToken = value;
	});
	return decodedToken;
};
