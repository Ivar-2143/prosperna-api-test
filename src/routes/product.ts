import { Router } from "express";
import ProductsController from "../controller/ProductsController";
import { authenticationCheck } from "../middlewares/authenticationCheck";
import { validateProduct } from "../middlewares/validateProduct";

//Instance of express Router;
const productRoutes: Router = Router();
//Initialization of ProductsController class
const productsController = new ProductsController();

//Route[GET] - /products - for fetching the list of products
productRoutes.get("/", productsController.index);

//Route[GET] - /products/:id - for fetching a single product,
productRoutes.get("/:id", productsController.getProduct);

//Route[POST] - /products - for creating product, goes through form validation and authentication check
productRoutes.post(
	"/",
	validateProduct,
	authenticationCheck,
	productsController.create
);

//Route[PUT] - /products/:id - for updating product, goes through form validation and authentication check
productRoutes.put(
	"/:id",
	validateProduct,
	authenticationCheck,
	productsController.update
);

//Route[DELETE] - /products/:id - for deleting product, goes through authentication check first before going to the delete controller
productRoutes.delete("/:id", authenticationCheck, productsController.delete);

export default productRoutes;
