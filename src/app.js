// app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorHandler } from "./api/v1/middleware/error.middleware.js";
import v1UsersRouter from "./api/v1/routes/user.routes.js";
import v1ProductsRouter from "./api/v1/routes/product.routes.js";
import v1CategoriesRouter from "./api/v1/routes/category.routes.js";
import v1AuthRouter from "./api/v1/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import v1UploadDownloadrouter from "./api/v1/routes/fileRoutes.js";
import { ENV } from './config/env.config.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js API " });
});

// route import
app.use("/api/v1/users", v1UsersRouter);
app.use("/api/v1/products", v1ProductsRouter);
app.use("/api/v1/categories", v1CategoriesRouter);
app.use("/api/v1/auth", v1AuthRouter);
app.use("/api/v1/files", v1UploadDownloadrouter);

// ----------------------------
// 404 Error Handler
// ----------------------------
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

console.log("db url ", ENV.DB)

// ----------------------------
// Global Error Handler
// ----------------------------
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
