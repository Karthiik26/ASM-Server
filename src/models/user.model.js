import { pool } from "../config/database.js";
import bcrypt from "bcrypt";

export const createUserService = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

export const getUserByEmailService = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

export const getUserByIdService = async (user_id) => {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    user_id,
  ]);
  return result.rows[0];
};

export const updateUserService = async (user_id, name, email) => {
  const updates = [];
  const values = [user_id];
  let paramIndex = 2;

  if (name) {
    updates.push(`name = $${paramIndex++}`);
    values.push(name);
  }

  if (email) {
    updates.push(`email = $${paramIndex++}`);
    values.push(email);
  }

  // No fields provided
  if (updates.length === 0) return null;

  const setClause = updates.join(", ");
  console.log(setClause);

  const result = await pool.query(
    `UPDATE users SET ${setClause} WHERE user_id = $1 RETURNING *`,
    values
  );

  return result.rows[0];
};

export const deleteUserService = async (user_id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE user_id = $1 RETURNING *",
    [user_id]
  );
  return result.rows[0];
};

export const updateUserPasswordService = async (user_id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const result = await pool.query(
    `UPDATE users SET password = $2 WHERE user_id = $1 RETURNING *`,
    [user_id, hashedPassword]
  );

  return result.rows[0];
};
