import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";
import productRoutes from "./product";

//Instance of express router;
const router: Router = Router();

//uses the routes based on each path that leads to the controller.
router.use("/login", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);

export default router;
