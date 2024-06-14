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
exports.validateProduct = void 0;
const zod_1 = __importStar(require("zod"));
const validateProduct = (req, res, next) => {
    // Schema for form validation
    const productValidationSchema = zod_1.default
        .object({
        product_name: zod_1.default
            .string({
            required_error: "product_name is required",
        })
            .min(3, "product_name must be at least (3) characters"),
        product_description: zod_1.default.string().optional(),
        product_price: zod_1.default
            .number({
            required_error: "product_price is required",
            invalid_type_error: "product_price must be a number",
        })
            .min(0.0, "product_price must be at least 0.00")
            .nonnegative({
            message: "product_price must be greater than or equal to zero(0)",
        })
            .multipleOf(0.01, {
            message: "product_price must only be (2) decimal places",
        }),
        product_tag: zod_1.default.string().array().optional(),
    })
        .required();
    try {
        //Parses the data to check if it is valid according to the validation schema
        productValidationSchema.parse(req.body);
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
exports.validateProduct = validateProduct;
