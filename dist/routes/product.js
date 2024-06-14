"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductsController_1 = __importDefault(require("../controller/ProductsController"));
const authenticationCheck_1 = require("../middlewares/authenticationCheck");
const validateProduct_1 = require("../middlewares/validateProduct");
//Instance of express Router;
const productRoutes = (0, express_1.Router)();
//Initialization of ProductsController class
const productsController = new ProductsController_1.default();
//Route[GET] - /products - for fetching the list of products
productRoutes.get("/", productsController.index);
//Route[GET] - /products/:id - for fetching a single product,
productRoutes.get("/:id", productsController.getProduct);
//Route[POST] - /products - for creating product, goes through form validation and authentication check
productRoutes.post("/", validateProduct_1.validateProduct, authenticationCheck_1.authenticationCheck, productsController.create);
//Route[PUT] - /products/:id - for updating product, goes through form validation and authentication check
productRoutes.put("/:id", validateProduct_1.validateProduct, authenticationCheck_1.authenticationCheck, productsController.update);
//Route[DELETE] - /products/:id - for deleting product, goes through authentication check first before going to the delete controller
productRoutes.delete("/:id", authenticationCheck_1.authenticationCheck, productsController.delete);
exports.default = productRoutes;
