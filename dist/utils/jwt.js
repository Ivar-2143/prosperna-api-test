"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = "JESUSlovesyou247!";
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: "1h" });
};
exports.createToken = createToken;
const validateToken = (token) => {
    let decodedToken = null;
    jsonwebtoken_1.default.verify(token, secret, (err, value) => {
        if (err)
            return null;
        decodedToken = value;
    });
    return decodedToken;
};
exports.validateToken = validateToken;
