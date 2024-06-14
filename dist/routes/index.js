"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const auth_1 = __importDefault(require("./auth"));
const product_1 = __importDefault(require("./product"));
//Instance of express router;
const router = (0, express_1.Router)();
//uses the routes based on each path that leads to the controller.
router.use("/login", auth_1.default);
router.use("/users", user_1.default);
router.use("/products", product_1.default);
exports.default = router;
