"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controller/AuthController"));
const authenticationCheck_1 = require("../middlewares/authenticationCheck");
//Instance of express router
const authRoutes = (0, express_1.Router)();
//Initialization of the AuthController class
const authController = new AuthController_1.default();
//Route[GET] - /login - gets the authenticated user, goes through authentication check
authRoutes.get("/", authenticationCheck_1.authenticationCheck, authController.index);
//Route[POST] - /login - for creating/registering a user.
authRoutes.post("/", authController.validate);
exports.default = authRoutes;
