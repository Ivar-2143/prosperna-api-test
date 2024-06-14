"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserUpdate = void 0;
const zod_1 = __importStar(require("zod"));
const validateUserUpdate = (req, res, next) => {
    // Schema for form validation
    const userValidationSchema = zod_1.default
        .object({
        email: zod_1.default.string().email(),
        password: zod_1.default.string().min(8),
    })
        .required();
    try {
        //Parses the data to check if it is valid according to the validation schema
        userValidationSchema.parse(req.body);
        //If the data is valid, proceeds to the next function or to the register function
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            let errors = {};
            //maps the list of errors if there are multiple errors
            err.issues.map((err) => {
                errors = { ...errors, [err.path[0]]: err.message };
            });
            //sends the errors for invalid data
            return res.status(400).send({ errors: errors });
        }
        //Unexpected error
        return res.status(500).send({ message: "Internal Server Error", err });
    }
};
exports.validateUserUpdate = validateUserUpdate;
