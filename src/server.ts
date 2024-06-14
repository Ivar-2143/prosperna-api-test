import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGODB_URI || "";

mongoose
	.connect(DB_URI)
	.then(() => console.log("connected to db"))
	.catch((err) => console.log(err));

app.listen(PORT, () => {
	console.log("Now listening on port " + PORT);
});
