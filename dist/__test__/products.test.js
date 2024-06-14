"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const UserModel_1 = __importDefault(require("../model/UserModel"));
const ProductModel_1 = __importDefault(require("../model/ProductModel"));
describe("Product Endpoints Testing", () => {
    const port = 1234;
    const BASE_URL = "http://localhost:" + port;
    dotenv_1.default.config();
    const TEST_DB_URI = process.env.TEST_DB_URI || "";
    let server;
    let login;
    beforeAll(async () => {
        try {
            const connection = await mongoose_1.default.connect(TEST_DB_URI);
            server = await app_1.default.listen(port, () => console.log("now listening to server on port " + port));
            await UserModel_1.default.deleteMany();
            await ProductModel_1.default.deleteMany();
            const data = {
                email: "user@example.com",
                password: "admin12345",
                password_confirmation: "admin12345",
            };
            await axios_1.default.post(`${BASE_URL}/users/register`, data);
            await axios_1.default.post(`${BASE_URL}/users/register`, {
                ...data,
                email: "customer@email.com",
            });
            await axios_1.default.post(`${BASE_URL}/users/register`, {
                ...data,
                email: "seller@email.com",
            });
            login = await axios_1.default.post(`${BASE_URL}/login`, {
                email: "user@example.com",
                password: "admin12345",
            });
        }
        catch (err) {
            console.log(err);
        }
    });
    afterAll(async () => await server.close());
    it("it Test POST - /products given that the user is authenticated, it should add the product successfully", async () => {
        const product = {
            product_name: "Puto Pao",
            product_price: 99.25,
            product_description: "The best puto-siopao in town",
            product_tag: ["puto", "food"],
        };
        const res = await axios_1.default.post(`${BASE_URL}/products`, product, {
            headers: {
                Authorization: `Bearer ${login.data.token}`,
            },
        });
        expect(res.status).toBe(200);
        expect(res.data.message).toBe("Product added successfully");
        expect(res.data.product.product_name).toBe(product.product_name);
    });
    it("it Test POST - /products given that product_name is blank with valid product params, it should return a required message", async () => {
        const product = {
            product_name: "",
            product_price: 55,
            product_description: "",
            product_tag: [],
        };
        await axios_1.default
            .post(`${BASE_URL}/products`, product, {
            headers: { Authorization: `Bearer ${login.data.token}` },
        })
            .catch((e) => {
            expect(e.response.status).toBe(400);
            expect(e.response.data.errors["product_name"]).toBe("product_name must be at least (3) characters");
        });
    });
    it("it Test POST - /products given that the price is negative, it return an error", async () => {
        const product = {
            product_name: "Puto Pao",
            product_price: -1,
            product_description: "The best puto-siopao in town",
            product_tag: ["puto", "food"],
        };
        await axios_1.default
            .post(`${BASE_URL}/products`, product, {
            headers: { Authorization: `Bearer ${login.data.token}` },
        })
            .catch((err) => {
            // console.log(err);
            expect(err.response.status).toBe(400);
            expect(err.response.data.errors["product_price"]).toBe("product_price must be greater than or equal to zero(0)");
        });
    });
    it("it Test POST - /products given that user is not authenticated, it should not let it add the product", async () => {
        const product = {
            product_name: "Puto Pao",
            product_price: 100,
            product_description: "The best puto-siopao in town",
            product_tag: ["puto", "food"],
        };
        await axios_1.default.post(`${BASE_URL}/products`, product).catch((err) => {
            expect(err.response.status).toBe(401);
            expect(err.response.data.message).toBe("Unauthorized");
        });
    });
    it("it Test GET - /products given that the enpoint is accessible to everyone , it should return the list of products", async () => {
        const product = {
            product_name: "",
            product_price: 0,
            product_description: "The best in town",
            product_tag: ["food"],
        };
        await axios_1.default.post(`${BASE_URL}/products`, { ...product, product_name: "Fried Siopao", product_price: 30 }, {
            headers: {
                Authorization: `Bearer ${login.data.token}`,
            },
        });
        await axios_1.default.post(`${BASE_URL}/products`, {
            ...product,
            product_name: "Ramen",
            product_price: 1,
        }, {
            headers: {
                Authorization: `Bearer ${login.data.token}`,
            },
        });
        await axios_1.default.post(`${BASE_URL}/products`, {
            ...product,
            product_name: "Chocolate Chip Cookies",
            product_price: 0.5,
        }, {
            headers: {
                Authorization: `Bearer ${login.data.token}`,
            },
        });
        let res = await axios_1.default.get(`${BASE_URL}/products`);
        expect(res.status).toBe(200);
        expect(res.data.title).toBe("List of products");
        expect(res.data.products.length).toBe(4);
    });
    it("it Test GET - /products/:id given that the enpoint is accessible to everyone , it should return a single product", async () => {
        let res = await axios_1.default.get(`${BASE_URL}/products`);
        let singleFetch = await axios_1.default.get(`${BASE_URL}/products/${res.data.products[0]._id}`);
        expect(res.status).toBe(200);
        expect(singleFetch.data.product.product_name).toBe(res.data.products[0].product_name);
    });
    it("it Test GET - /products/:id given that the does not exists, it should return an error 404", async () => {
        await axios_1.default.get(`${BASE_URL}/products/${new mongodb_1.ObjectId()}`).catch((e) => {
            expect(e.response.status).toBe(404);
            expect(e.response.data.message).toBe("Product not found");
        });
    });
    it("it Test PUT - /products/:id given that the parameters are valid and user is authorized , it should update the product", async () => {
        const products = await axios_1.default.get(`${BASE_URL}/products`);
        const puto_pao = products.data.products.find((i) => i.product_name == "Puto Pao");
        const product = {
            product_name: "Puto Plain",
            product_price: 23.04,
            product_description: "The best milky plain puto in town",
            product_tag: ["puto", "food"],
        };
        let res = await axios_1.default.put(`${BASE_URL}/products/${puto_pao._id}`, product, {
            headers: {
                Authorization: `Bearer ${login.data.token}`,
            },
        });
        expect(res.status).toBe(200);
        expect(res.data.message).toBe("Updated Successfully");
        expect(res.data.product.product_name).toBe(product.product_name);
    });
    it("it Test PUT - /products/:id given that product_name is blank with valid product params, it should return a required message", async () => {
        const product_list = await axios_1.default.get(`${BASE_URL}/products`);
        const data = {
            product_name: "",
            product_price: 55,
            product_description: "",
            product_tag: [],
        };
        await axios_1.default
            .put(`${BASE_URL}/products/${product_list.data.products[0]._id}`, data, {
            headers: { Authorization: `Bearer ${login.data.token}` },
        })
            .catch((e) => {
            expect(e.response.status).toBe(400);
            expect(e.response.data.errors["product_name"]).toBe("product_name must be at least (3) characters");
        });
    });
    it("it Test PUT - /products/:id given that the price is negative, it return an error", async () => {
        const product_list = await axios_1.default.get(`${BASE_URL}/products`);
        const data = {
            product_name: "Puto Pao",
            product_price: -1,
            product_description: "The best puto-siopao in town",
            product_tag: ["puto", "food"],
        };
        await axios_1.default
            .put(`${BASE_URL}/products/${product_list.data.products[0]._id}`, data, {
            headers: { Authorization: `Bearer ${login.data.token}` },
        })
            .catch((err) => {
            // console.log(err);
            expect(err.response.status).toBe(400);
            expect(err.response.data.errors["product_price"]).toBe("product_price must be greater than or equal to zero(0)");
        });
    });
    it("it Test PUT - /products/:id given that user is not authenticated, it should not let it update the product", async () => {
        const product_list = await axios_1.default.get(`${BASE_URL}/products`);
        const product = {
            product_name: "Puto Pao",
            product_price: 100,
            product_description: "The best puto-siopao in town",
            product_tag: ["puto", "food"],
        };
        await axios_1.default
            .put(`${BASE_URL}/products/${product_list.data.products._id}`, product)
            .catch((err) => {
            expect(err.response.status).toBe(401);
            expect(err.response.data.message).toBe("Unauthorized");
        });
    });
    it("it Test PUT - /products/:id given that the user is not the owner of the product, it should not update the product", async () => {
        const new_login = await axios_1.default.post(`${BASE_URL}/login`, {
            email: "customer@email.com",
            password: "admin12345",
        });
        const products = await axios_1.default.get(`${BASE_URL}/products`);
        const product = {
            product_name: "Pichi pichi",
            product_price: 35.55,
            product_description: "The best in town",
            product_tag: ["food"],
        };
        await axios_1.default
            .put(`${BASE_URL}/products/${products.data.products[0]._id}`, product, {
            headers: {
                Authorization: `Bearer ${new_login.data.token}`,
            },
        })
            .catch((err) => {
            expect(err.response.status).toBe(403);
            expect(err.response.data.message).toBe("You are not allowed to edit this product.");
        });
    });
    it("it Test DELETE - /products/:id given that the user is not authenticated, it should return Unauthorized", async () => {
        const product_list = await axios_1.default.get(`${BASE_URL}/products`);
        await axios_1.default
            .delete(`${BASE_URL}/products/${product_list.data.products[0]._id}`)
            .catch((err) => {
            expect(err.response.status).toBe(401);
            expect(err.response.data.message).toBe("Unauthorized");
        });
    });
    it("it Test DELETE - /products/:id given that the user is not the owner of the product, it should return Forbidden", async () => {
        const new_login = await axios_1.default.post(`${BASE_URL}/login`, {
            email: "customer@email.com",
            password: "admin12345",
        });
        const product_list = await axios_1.default.get(`${BASE_URL}/products`);
        await axios_1.default
            .delete(`${BASE_URL}/products/${product_list.data.products[0]._id}`, {
            headers: {
                Authorization: `Bearer ${new_login.data.token}`,
            },
        })
            .catch((err) => {
            expect(err.response.status).toBe(403);
            expect(err.response.data.message).toBe("You are not allowed to delete this product.");
        });
    });
    it("it Test DELETE - /products/:id given that the user is authenticated and the owner, it should delete the product", async () => {
        const product_list = await axios_1.default.get(`${BASE_URL}/products`);
        const removed_product = await axios_1.default.delete(`${BASE_URL}/products/${product_list.data.products[0]._id}`, {
            headers: {
                Authorization: `Bearer ${login.data.token}`,
            },
        });
        expect(removed_product.status).toBe(200);
        expect(removed_product.data.title).toBe("Deleted Successfully");
        expect(removed_product.data.product.product_name).toBe(product_list.data.products[0].product_name);
    });
});
