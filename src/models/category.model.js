import { pool } from "../config/database.js";

export const createCategoryService = async (name, user_id) => {
  const result = await pool.query(
    "INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *",
    [name, user_id]
  );
  return result.rows[0];
};

// user-scoped
// get all categories by users id
export const getAllCategoriesService = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM categories WHERE user_id = $1 ORDER BY name",
    [user_id]
  );
  return result.rows;
};

// user-scoped
export const getCategorieByIdService = async (unique_id, user_id) => {
  const result = await pool.query(
    "SELECT * FROM categories WHERE unique_id = $1 AND user_id = $2",
    [unique_id, user_id]
  );
  return result.rows[0]; // single object
};

// user-scoped
export const updateCategorieByIdService = async (unique_id, name, user_id) => {
  const result = await pool.query(
    "UPDATE categories SET name = $2, updated_at = CURRENT_TIMESTAMP WHERE unique_id = $1 AND user_id = $3 RETURNING *",
    [unique_id, name, user_id]
  );
  return result.rows[0];
};

// user-scoped
export const deleteCategorieService = async (unique_id, user_id) => {
  const result = await pool.query(
    "DELETE FROM categories WHERE unique_id = $1 AND user_id = $2 RETURNING *",
    [unique_id, user_id]
  );
  return result.rows[0];
};
