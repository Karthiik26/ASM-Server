import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import { ENV } from "./config/env.config.js";
import { initDB, pool } from "./config/database.js";

dotenv.config();

const { PORT } = ENV;

const startServer = async () => {
  try {
    const client = await pool.connect();

    const res = await client.query("SELECT NOW()");
    console.log(`✅ PostgreSQL connected successfully at ${res.rows[0].now}`);
    client.release();
    await initDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
