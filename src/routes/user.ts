import { Router } from "express";
import UsersController from "../controller/UsersController";
import { validateUserRegistration } from "../middlewares/validateUserRegistration";
import { encrpytSaltAndPassword } from "../middlewares/encrpytSaltAndPassword";
import { generateAccessLevel } from "../middlewares/generateAccessLevel";
import { validateUserUpdate } from "../middlewares/validateUserUpdate";
import { authenticationCheck } from "../middlewares/authenticationCheck";

//Instance of express Router
const userRoutes: Router = Router();
//Initialization of UsersController class
const usersController = new UsersController();

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
userRoutes.put(
	"/:id",
	validateUserUpdate,
	encrpytSaltAndPassword,
	authenticationCheck,
	usersController.update
);

/*
*   Route[DELETE] - /users/:id
    It is an protected route that goes through authentication check middleware before it proceeds
*/
userRoutes.delete("/:id", authenticationCheck, usersController.delete);

/*
*   Route[POST] - /users/register
    It goes through couple of middlewares, it validates the form first, 
    then encrypts the password and generates a salt. 
    then it generates an access level before going through the actual route
*/
userRoutes.post(
	"/register",
	validateUserRegistration,
	encrpytSaltAndPassword,
	generateAccessLevel,
	usersController.register
);

export default userRoutes;
