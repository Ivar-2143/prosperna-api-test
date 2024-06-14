"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationCheck = void 0;
const jwt_1 = require("../utils/jwt");
const authenticationCheck = (req, res, next) => {
    try {
        //Checks for autherization in the headers
        const authHeader = req.headers["authorization"];
        //Splits the authorization value into two [Bearer, token]
        const token = (authHeader && authHeader.split(" ")[1]) || "";
        //Validates the token and returns the decoded value
        const decodedToken = (0, jwt_1.validateToken)(token);
        //Throws an error if the token is invalid
        if (!token || !decodedToken) {
            throw new Error("Unauthorized");
        }
        //Attaches the payload id based on the logged-in user id to the req.body
        req.body.id = decodedToken.id;
        //proceeds to the next function
        next();
    }
    catch (err) {
        if (err.message == "Unauthorized") {
            //if no token is found
            return res
                .status(401)
                .send({ title: "Unauthorized", message: "Unauthorized" });
        }
        //Unexpected error
        return res.status(500).send({ title: "Internal Server Error", err });
    }
};
exports.authenticationCheck = authenticationCheck;
