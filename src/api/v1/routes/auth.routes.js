import express from "express";
import {
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const v1AuthRouter = express.Router();

// Login route (public)
v1AuthRouter.post("/login", loginController);

// Logout route (protected, needs JWT token)
v1AuthRouter.post("/logout", authenticateUser, logoutController);

export default v1AuthRouter;
