import { pool } from "../config/database.js";

// Create a new product for a user
export const createProductServices = async ({
  name,
  image,
  price,
  category_id,
  user_id,
}) => {
  const query = `
    INSERT INTO products (name, image, price, category_id, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [name, image, price, category_id, user_id]; // Correctly pass user_id

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Get a product by unique_id for a specific user
export const getProductByIdServices = async (unique_id, user_id) => {
  const query = `
    SELECT
      p.unique_id AS product_id,
      p.name AS product_name,
      p.image,
      p.price,
      p.created_at,
      p.updated_at,
      json_build_object(
        'unique_id', c.unique_id,
        'name', c.name,
        'created_at', c.created_at,
        'updated_at', c.updated_at
      ) AS category
    FROM products p
    JOIN categories c ON p.category_id = c.unique_id
    WHERE p.unique_id = $1 AND p.user_id = $2;
  `;
  const { rows } = await pool.query(query, [unique_id, user_id]);
  return rows[0];
};

// Get all products for a user with pagination, search, and sorting, including full category info
export const getAllProductsServices = async ({
  user_id,
  page = 1,
  limit = 10,
  search = "",
  category = "",
  sort = "price_asc",
}) => {
  const offset = (page - 1) * limit;

  let order = "p.price ASC";
  if (sort === "price_desc") order = "p.price DESC";

  let conditions = ["p.user_id = $1"];
  let values = [user_id];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(p.name ILIKE $${values.length} OR c.name ILIKE $${values.length})`
    );
  }

  if (category) {
    values.push(category);
    conditions.push(`p.category_id = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const query = `
    SELECT 
      p.unique_id AS product_id,
      p.name AS product_name,
      p.image,
      p.price,
      p.created_at,
      p.updated_at,
      json_build_object(
        'unique_id', c.unique_id,
        'name', c.name,
        'created_at', c.created_at,
        'updated_at', c.updated_at
      ) AS category
    FROM products p
    JOIN categories c ON p.category_id = c.unique_id
    ${whereClause}
    ORDER BY ${order}
    LIMIT $${values.length + 1} OFFSET $${values.length + 2};
  `;

  values.push(limit, offset);

  const { rows } = await pool.query(query, values);

  return rows;
};

// Update
export const updateProductByIdServices = async (
  unique_id,
  user_id,
  updates
) => {
  // Build SET clause dynamically
  const setClauses = [];
  const values = [];
  let index = 1;

  for (const key of ["name", "image", "price", "category_id"]) {
    if (updates[key] !== undefined) {
      setClauses.push(`${key} = $${index}`);
      values.push(updates[key]);
      index++;
    }
  }

  if (setClauses.length === 0) {
    return null; // Nothing to update
  }

  // Always update the updated_at timestamp
  setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

  // Add unique_id and user_id for the WHERE clause
  values.push(unique_id, user_id);

  const query = `
    UPDATE products
    SET ${setClauses.join(", ")}
    WHERE unique_id = $${index} AND user_id = $${index + 1}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Delete
export const deleteProductServices = async (unique_id, user_id) => {
  const query = `
    DELETE FROM products 
    WHERE unique_id=$1 AND user_id=$2
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [unique_id, user_id]);
  return rows[0];
};


