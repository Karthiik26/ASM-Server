import express from "express";
import {
  createCategoryController,
  deleteCategorieController,
  getAllCategoriesController,
  getCategorieByIdController,
  updateCategorieByIdController,
} from "../controllers/category.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const v1CategoriesRouter = express.Router();

// Protect all routes
v1CategoriesRouter.use(authenticateUser);

// Create a category
v1CategoriesRouter.post("/", createCategoryController);

// Get all categories of current user
v1CategoriesRouter.get("/", getAllCategoriesController);

// Get a single category by unique_id
v1CategoriesRouter.get("/:unique_id", getCategorieByIdController);

// Update a category
v1CategoriesRouter.put("/:unique_id", updateCategorieByIdController);

// Delete a category
v1CategoriesRouter.delete("/:unique_id", deleteCategorieController);

export default v1CategoriesRouter;
