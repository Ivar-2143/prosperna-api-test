import { Router } from "express";
import AuthController from "../controller/AuthController";
import { authenticationCheck } from "../middlewares/authenticationCheck";

//Instance of express router
const authRoutes: Router = Router();
//Initialization of the AuthController class
const authController = new AuthController();

//Route[GET] - /login - gets the authenticated user, goes through authentication check
authRoutes.get("/", authenticationCheck, authController.index);
//Route[POST] - /login - for creating/registering a user.
authRoutes.post("/", authController.validate);

export default authRoutes;
