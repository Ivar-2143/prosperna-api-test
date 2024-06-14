import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import router from "./routes";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 1234;

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

export default app;
