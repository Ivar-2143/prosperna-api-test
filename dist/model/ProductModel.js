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
const mongodb_1 = require("mongodb");
const mongoose_1 = __importStar(require("mongoose"));
//The schema of Product just like the typeface or the interface in typescript
const ProductSchema = new mongoose_1.Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_price: {
        type: mongodb_1.Decimal128,
        required: true,
    },
    product_description: {
        type: String,
    },
    product_tag: {
        type: (Array),
    },
    seller: {
        type: mongodb_1.ObjectId,
        required: true,
    },
}, { timestamps: true });
//Wraps the ProductSchema with collection name of "User" to an Object Model specifically a Mongoose Object or also the Model Class
const Product = mongoose_1.default.model("Product", ProductSchema);
exports.default = Product;
