import { Router } from "express";
import {createProductController, getProductsController, getProductController, updateProductController, deleteProductController,searchProductsController } from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
// import { deleteProductController, getProductController, getProductsController, searchProductsController, updateProductController } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/create", verifyToken, createProductController);
productRouter.get("/get", getProductsController);
productRouter.get("/get/:id", getProductController);
productRouter.get("/search", searchProductsController);
productRouter.put("/update/:id", verifyToken, updateProductController);
productRouter.delete("/delete/:id", verifyToken, deleteProductController);

export default productRouter;