import { Server } from "http";
import app from "../app";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../model/UserModel";
import { ObjectId } from "mongodb";

describe("User Endpoints Testing", () => {
	const port = 1234;
	const BASE_URL = "http://localhost:" + port;
	dotenv.config();
	const TEST_DB_URI = process.env.TEST_DB_URI || "";
	let server: Server;
	beforeAll(async () => {
		try {
			const connection = await mongoose.connect(TEST_DB_URI);
			server = await app.listen(port, () =>
				console.log("now listening to server on port " + port)
			);
			await User.deleteMany();
		} catch (err) {
			console.error("Failed to connecto to MongoDB");
		}
	});
	afterAll(async () => await server.close());

	it("it Tests POST - /users/register given a valid parameters, it should return successfully registered.", async () => {
		const data = {
			email: "sample@email.com",
			password: "admin12345",
			password_confirmation: "admin12345",
		};
		try {
			const res = await axios.post(`${BASE_URL}/users/register`, data);
			expect(res.status).toBe(200);
			expect(res.data.message).toBe("Successfully Registered");
		} catch (e: any) {
			console.log(e.response.data.errors);
		}
	});

	it("it Tests POST - /users/register given a invalid email, it should return invalid email message", async () => {
		const data = {
			email: "example_email.com",
			password: "admin12345",
			password_confirmation: "admin12345",
		};
		axios.post(`${BASE_URL}/users/register`, data).catch((err) => {
			expect(err.response.statusText).toBe("Bad Request");
			expect(err.response.data.errors["email"]).toBe("Invalid email");
		});
	});

	it("it Tests POST - /users/register given a blank password, it should return required password message", async () => {
		const data = {
			email: "example@email.com",
			password: "",
			password_confirmation: "admin12345",
		};
		axios.post(`${BASE_URL}/users/register`, data).catch((err) => {
			expect(err.response.statusText).toBe("Bad Request");
			expect(err.response.data.errors["password"]).toBe(
				"String must contain at least 8 character(s)"
			);
		});
	});

	it("it Tests POST - /users/register given a unmatching password, it should return that password doesn't match", async () => {
		const data = {
			email: "example@email.com",
			password: "admin12345",
			password_confirmation: "",
		};
		axios.post(`${BASE_URL}/users/register`, data).catch((err) => {
			expect(err.response.statusText).toBe("Bad Request");
			expect(err.response.data.errors["password_confirmation"]).toBe(
				"Password does not match"
			);
		});
	});

	it("Tests GET - /users It should return the List of Users", async () => {
		const dummy_data = {
			email: "randommail@gmail.com",
			password: "admin12345",
			password_confirmation: "admin12345",
		};
		await axios.post(`${BASE_URL}/users/register`, dummy_data);

		const res = await axios.get(`${BASE_URL}/users`);
		expect(res.status).toBe(200);
		expect(res.data.title).toBe("List of Users");
		expect(res.data.users.length).toBe(2);
	});

	it("Tests GET - /users/:id given that id is valid, It should return the user info", async () => {
		const res = await axios.get(`${BASE_URL}/users`);
		const singleUser = await axios.get(
			`${BASE_URL}/users/${res.data.users[0]._id}`
		);
		expect(singleUser.status).toBe(200);
		expect(singleUser.data.title).toBe("User");
		expect(singleUser.data.user._id).toBe(res.data.users[0]._id);
	});

	it("Tests GET - /users/:id given that id doesn't exist, It should return error not found", async () => {
		axios.get(`${BASE_URL}/users/${new ObjectId()}`).catch((err) => {
			expect(err.response.data.title).toBe("Not Found");
			expect(err.response.data.message).toBe("User not found");
		});
	});
	it("Tests PUT - /users/:id given that data is valid, It should update the user data", async () => {
		const data = {
			email: "sample@email.com",
			password: "admin12345",
		};
		const updated_data = {
			email: "new_mail@email.com",
			password: "admin12345",
		};
		const login = await axios.post(`${BASE_URL}/login`, data);
		const headers = {
			Authorization: `Bearer ${login.data.token}`,
		};
		const loggedInUser = await axios.get(`${BASE_URL}/login`, {
			headers: headers,
		});
		const update = await axios.put(
			`${BASE_URL}/users/${loggedInUser.data.user._id}`,
			updated_data,
			{
				headers: headers,
			}
		);
		expect(update.status).toBe(200);
		expect(update.data.message).toBe("Updated Successfully");
		expect(update.data.user.email).toBe(updated_data.email);
	});

	it("Tests PUT - /users/:id given that the account is not yours, It should return an forbidden error", async () => {
		const users = await axios.get(`${BASE_URL}/users`);
		const login = await axios.post(`${BASE_URL}/login`, {
			email: users.data.users[0].email,
			password: "admin12345",
		});
		axios
			.put(
				`${BASE_URL}/users/${users.data.users[1]._id}`,
				{ email: "new_email@gmail.com", password: "admin12345" },
				{ headers: { Authorization: `Bearer ${login.data.token}` } }
			)
			.catch((err) => {
				expect(err.response.status).toBe(403);
				expect(err.response.data.message).toBe(
					"You are not allowed to update this account"
				);
			});
	});

	it("Tests PUT - /users/:id given that email is invalid, It should not update the user data", async () => {
		const data = {
			email: "randommail@gmail.com",
			password: "admin12345",
		};
		const updated_data = {
			email: "asda",
			password: "admin12345",
		};
		const login = await axios.post(`${BASE_URL}/login`, data);
		const headers = {
			Authorization: `Bearer ${login.data.token}`,
		};
		const loggedInUser = await axios.get(`${BASE_URL}/login`, { headers });
		axios
			.put(
				`${BASE_URL}/users/${loggedInUser.data.user._id}`,
				updated_data,
				{
					headers: { Authorization: `Bearer ${login.data.token}` },
				}
			)
			.catch((err) => {
				expect(err.response.status).toBe(400);
				expect(err.response.data.errors["email"]).toBe("Invalid email");
			});
	});

	it("Tests PUT - /users/:id given that password is invalid, It should not update the user data", async () => {
		const data = {
			email: "randommail@gmail.com",
			password: "admin12345",
		};
		const updated_data = {
			email: "newemail@example.com",
			password: "",
		};
		const login = await axios.post(`${BASE_URL}/login`, data);
		const headers = {
			Authorization: `Bearer ${login.data.token}`,
		};
		const loggedInUser = await axios.get(`${BASE_URL}/login`, { headers });
		await axios
			.put(
				`${BASE_URL}/users/${loggedInUser.data.user._id}`,
				updated_data,
				{
					headers: { Authorization: `Bearer ${login.data.token}` },
				}
			)
			.catch((err) => {
				expect(err.response.status).toBe(400);
				expect(err.response.data.errors["password"]).toBe(
					"String must contain at least 8 character(s)"
				);
			});
	});
	it("Test DELETE - /users/:id given an invalid ID, it should delete the owner's account", async () => {
		const users = await axios.get(`${BASE_URL}/users`);
		const login = await axios.post(`${BASE_URL}/login`, {
			email: users.data.users[0].email,
			password: "admin12345",
		});
		axios
			.delete(`${BASE_URL}/users/${new ObjectId()}`, {
				headers: {
					Authorization: `Bearer ${login.data.token}`,
				},
			})
			.catch((err) => {
				expect(err.response.status).toBe(403);
				expect(err.response.data.message).toBe(
					"You are not allowed to delete this account"
				);
			});
	});
	it("Test DELETE - /users/:id given a valid ID, it should delete the owner's account", async () => {
		const users = await axios.get(`${BASE_URL}/users`);
		const login = await axios.post(`${BASE_URL}/login`, {
			email: users.data.users[0].email,
			password: "admin12345",
		});
		const removed_account = await axios.delete(
			`${BASE_URL}/users/${users.data.users[0]._id}`,
			{
				headers: {
					Authorization: `Bearer ${login.data.token}`,
				},
			}
		);
		expect(removed_account.status).toBe(200);
		expect(removed_account.data.message).toBe("Deleted Successfully");
	});
});
