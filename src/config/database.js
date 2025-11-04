import pkg from "pg";
import { ENV } from "./env.config.js";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: ENV.DB,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection when the pool starts
pool.on("connect", () => {
  console.log("🔗 PostgreSQL pool connected");
});

// Handle unexpected errors
pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error:", err.message);
  process.exit(-1);
});

// Graceful shutdown on process termination
process.on("SIGINT", async () => {
  await pool.end();
  console.log("🛑 PostgreSQL pool has ended");
  process.exit(0);
});

// Initialize tables
export const initDB = async () => {
  try {
    // Enable UUID generation extension
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // Users table
    await pool.query(`
     CREATE TABLE IF NOT EXISTS users (
  user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'seller' CHECK (role IN ('admin', 'seller')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);

    // Categories table (owned by a user)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        unique_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Products table (owned by a user and linked to a category)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        unique_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID  NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        category_id UUID NOT NULL REFERENCES categories(unique_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(500),
        price NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log(
      "✅ Neon DB tables with user ownership created successfully or already exist."
    );
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
    process.exit(1);
  }
};
