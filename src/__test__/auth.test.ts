import { Server } from "http";
import axios from "axios";
import app from "../app";
import mongoose from "mongoose";
import User from "../model/UserModel";
import dotenv from "dotenv";

describe("Login Auth Testing", () => {
	const port = 1234;
	const BASE_URL = "http://localhost:" + port;
	dotenv.config();
	const TEST_DB_URI = process.env.TEST_DB_URI || "";
	let server: Server;
	const data = {
		email: "example@yahoo.com",
		password: "admin12345",
		password_confirmation: "admin12345",
	};
	beforeAll(async () => {
		try {
			const connection = await mongoose.connect(TEST_DB_URI);
			server = app.listen(port, () =>
				console.log("now listening to server on port " + port)
			);
			await User.deleteMany();
			await axios.post(`${BASE_URL}/users/register`, data);
		} catch (err) {
			console.log("failed to connect to MongoDB");
		}
	});
	afterAll(async () => server.close());

	it("it Tests POST /login given a valid credentials, it should log in", async () => {
		const res = await axios.post(`${BASE_URL}/login`, data);
		expect(res.status).toBe(200);
		expect(res.data.message).toBe("Login Successfully");
	});

	it("it Tests GET /login given a valid credentials, it should give back the current logged in user", async () => {
		const res = await axios.post(`${BASE_URL}/login`, data);
		const loggedInUser = await axios.get(`${BASE_URL}/login`, {
			headers: {
				Authorization: `Bearer ${res.data.token}`,
			},
		});
		expect(loggedInUser.data.user.email).toBe(data.email);
	});

	it("it Tests POST /login given an invalid credentials it should not log in", async () => {
		await axios
			.post(`${BASE_URL}/login`, {
				email: "test@example.com",
				password: "admin12345",
			})
			.catch((err) => {
				expect(err.response.statusText).toBe("Unauthorized");
				expect(err.response.data.message).toBe(
					"Email or password is incorrect"
				);
			});
	});
	it("it Tests POST /login given an invalid email it should not log in", async () => {
		await axios
			.post(`${BASE_URL}/login`, {
				email: "test.com",
				password: "",
			})
			.catch((err) => {
				expect(err.response.statusText).toBe("Unauthorized");
				expect(err.response.data.message).toBe(
					"Email or password is incorrect"
				);
			});
	});
	it("it Tests POST /login given an blank password it should not log in", async () => {
		await axios
			.post(`${BASE_URL}/login`, {
				email: "test@example.com",
				password: "",
			})
			.catch((err) => {
				expect(err.response.statusText).toBe("Unauthorized");
				expect(err.response.data.message).toBe(
					"Email or password is incorrect"
				);
			});
	});
});
