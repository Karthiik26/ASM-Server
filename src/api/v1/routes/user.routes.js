import express from "express";
import {
  createUserController,
  getUserByEmailController,
  updateUserController,
  deleteUserController,
  updateUserPasswordController,
  getUserByIdController,
  createAdminUserService,
} from "../controllers/user.controller.js";

import { authenticateUser } from "../middleware/auth.middleware.js";

const v1UsersRouter = express.Router();

// PUBLIC: Create sellar
v1UsersRouter.post("/admin",  createAdminUserService);

// PUBLIC: Create sellar
v1UsersRouter.post("/",  createUserController);

// PROTECTED: Only authenticated users
v1UsersRouter.use(authenticateUser);

// Get own info by email
v1UsersRouter.get("/email/:email", getUserByEmailController);

// Get own info by id
v1UsersRouter.get("/me", getUserByIdController);

// Update current user
v1UsersRouter.put("/me", updateUserController);

// Update current user's password
v1UsersRouter.put("/me/password", updateUserPasswordController);

// Delete current user
v1UsersRouter.delete("/me", deleteUserController);

export default v1UsersRouter;
