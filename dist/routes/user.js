"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController_1 = __importDefault(require("../controller/UsersController"));
const validateUserRegistration_1 = require("../middlewares/validateUserRegistration");
const encrpytSaltAndPassword_1 = require("../middlewares/encrpytSaltAndPassword");
const generateAccessLevel_1 = require("../middlewares/generateAccessLevel");
const validateUserUpdate_1 = require("../middlewares/validateUserUpdate");
const authenticationCheck_1 = require("../middlewares/authenticationCheck");
//Instance of express Router
const userRoutes = (0, express_1.Router)();
//Initialization of UsersController class
const usersController = new UsersController_1.default();
//Index is always for retreiving list of data, in this case, it's the list of users
userRoutes.get("/", usersController.index);
//Route[GET] - for fetching a single user
userRoutes.get("/:id", usersController.getUser);
/*
* Route[PUT] - /uses/:id
    It goes through couple of middlewares, it validates the form first,
    then encrypts the password and generates a new salt.
    then it checks if the user is authenticated before going to the actual route/controller
*/
userRoutes.put("/:id", validateUserUpdate_1.validateUserUpdate, encrpytSaltAndPassword_1.encrpytSaltAndPassword, authenticationCheck_1.authenticationCheck, usersController.update);
/*
*   Route[DELETE] - /users/:id
    It is an protected route that goes through authentication check middleware before it proceeds
*/
userRoutes.delete("/:id", authenticationCheck_1.authenticationCheck, usersController.delete);
/*
*   Route[POST] - /users/register
    It goes through couple of middlewares, it validates the form first,
    then encrypts the password and generates a salt.
    then it generates an access level before going through the actual route
*/
userRoutes.post("/register", validateUserRegistration_1.validateUserRegistration, encrpytSaltAndPassword_1.encrpytSaltAndPassword, generateAccessLevel_1.generateAccessLevel, usersController.register);
exports.default = userRoutes;
