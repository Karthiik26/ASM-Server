import {
  createCategoryService,
  deleteCategorieService,
  getAllCategoriesService,
  getCategorieByIdService,
  updateCategorieByIdService,
} from "../../../models/category.model.js";
import { handleResponse } from "../../../utils/response.helper.js";

// Create category
export const createCategoryController = async (req, res, next) => {
  const { name } = req.body;
  const user_id = req.user.id; // Use authenticated user
  try {
    const newCategory = await createCategoryService(name, user_id);
    return handleResponse(
      res,
      201,
      "Category created successfully",
      newCategory
    );
  } catch (error) {
    next(error);
  }
};

// Get all categories of current user
export const getAllCategoriesController = async (req, res, next) => {
  const user_id = req.user.id;
  try {
    const categories = await getAllCategoriesService(user_id);
    if (!categories || categories.length === 0) {
      return handleResponse(res, 404, "No categories found");
    }
    return handleResponse(
      res,
      200,
      "Categories retrieved successfully",
      categories
    );
  } catch (error) {
    next(error);
  }
};

// Get a category by unique_id
export const getCategorieByIdController = async (req, res, next) => {
  const user_id = req.user.id;
  const { unique_id } = req.params;
  try {
    const category = await getCategorieByIdService(unique_id, user_id);
    if (!category) {
      return handleResponse(res, 404, "Category not found");
    }
    return handleResponse(
      res,
      200,
      "Category retrieved successfully",
      category
    );
  } catch (error) {
    next(error);
  }
};

// Update a category
export const updateCategorieByIdController = async (req, res, next) => {
  const user_id = req.user.id;
  const { unique_id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await updateCategorieByIdService(
      unique_id,
      name,
      user_id
    );
    if (!updatedCategory) {
      return handleResponse(res, 404, "Category not found");
    }
    return handleResponse(
      res,
      200,
      "Category updated successfully",
      updatedCategory
    );
  } catch (error) {
    next(error);
  }
};

// Delete a category
export const deleteCategorieController = async (req, res, next) => {
  const user_id = req.user.id;
  const { unique_id } = req.params;
  try {
    const deletedCategory = await deleteCategorieService(unique_id, user_id);
    if (!deletedCategory) {
      return handleResponse(res, 404, "Category not found");
    }
    return handleResponse(
      res,
      200,
      "Category deleted successfully",
      deletedCategory
    );
  } catch (error) {
    next(error);
  }
};
