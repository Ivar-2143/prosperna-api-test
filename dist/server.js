"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGODB_URI || "";
mongoose_1.default
    .connect(DB_URI)
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err));
app_1.default.listen(PORT, () => {
    console.log("Now listening on port " + PORT);
});
