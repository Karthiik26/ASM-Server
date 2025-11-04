import express from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "../controllers/product.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { uploadImage } from "../middleware/filter.middleware.js";

const v1ProductsRouter = express.Router();
// Protected routes
v1ProductsRouter.use(authenticateUser);

v1ProductsRouter.post(
  "/",
  uploadImage.single("image"),
  createProductController
);
v1ProductsRouter.get("/", getAllProductsController);
v1ProductsRouter.get("/:id", getProductByIdController);
v1ProductsRouter.put(
  "/:id",
  uploadImage.single("image"),
  updateProductController
);
v1ProductsRouter.delete("/:id", deleteProductController);

export default v1ProductsRouter;
