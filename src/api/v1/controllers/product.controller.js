import { handleResponse } from "../../../utils/response.helper.js";
import {
  getProductByIdServices,
  getAllProductsServices,
  updateProductByIdServices,
  deleteProductServices,
  createProductServices,
} from "../../../models/product.model.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.helper.js";

// Create a product
export const createProductController = async (req, res, next) => {
  try {
    const { name, price, category_id } = req.body;
    const user_id = req.user.id;

    if (!user_id || !name || !price || !category_id) {
      return handleResponse(res, 400, "Name, Price, and Category are required");
    }

    // Upload image if provided
    let imageUrl = null;
    if (req.file) {
      const fileBuffer = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await uploadToCloudinary(fileBuffer, "products");
      imageUrl = uploadResult.url;
    }

    // Create product
    const product = await createProductServices({
      name,
      image: imageUrl,
      price,
      category_id,
      user_id,
    });

    return handleResponse(res, 201, "Product created successfully", product);
  } catch (error) {
    next(error);
  }
};

// Get a single product by ID
export const getProductByIdController = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const product = await getProductByIdServices(id, user_id);

    if (!product) return handleResponse(res, 404, "Product not found");

    return handleResponse(res, 200, "Product retrieved successfully", product);
  } catch (error) {
    next(error);
  }
};

// Get all products (with optional pagination, search, category filter, sorting)
export const getAllProductsController = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      sort = "price_asc",
    } = req.query;

    const products = await getAllProductsServices({
      user_id,
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      category,
      sort,
    });

    return handleResponse(res, 200, "Products retrieved successfully", {
      data: products,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    next(error);
  }
};

// Update a product
export const updateProductController = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const updates = { ...req.body };

    // Handle file upload if present
    if (req.file) {
      const fileBuffer = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await uploadToCloudinary(fileBuffer, "products");
      updates.image = uploadResult.url;
    }

    // Prevent empty updates (no fields and no image)
    if (Object.keys(updates).length === 0) {
      return handleResponse(res, 400, "No fields provided for update");
    }

    const updatedProduct = await updateProductByIdServices(
      id,
      user_id,
      updates
    );

    if (!updatedProduct) {
      return handleResponse(res, 404, "Product not found or nothing to update");
    }

    return handleResponse(
      res,
      200,
      "Product updated successfully",
      updatedProduct
    );
  } catch (error) {
    next(error);
  }
};

// Delete a product
export const deleteProductController = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const deletedProduct = await deleteProductServices(id, user_id);

    if (!deletedProduct) return handleResponse(res, 404, "Product not found");

    return handleResponse(
      res,
      200,
      "Product deleted successfully",
      deletedProduct
    );
  } catch (error) {
    next(error);
  }
};
