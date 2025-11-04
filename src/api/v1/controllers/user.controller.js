import {
  createUserService,
  getUserByEmailService,
  updateUserService,
  deleteUserService,
  updateUserPasswordService,
  getUserByIdService,
} from "../../../models/user.model.js";

import { handleResponse } from "../../../utils/response.helper.js";

export const createAdminUserService = async (
  email,
  name,
  password,
  role = "admin"
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id, name, email, role, created_at;
    `,
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};

// CREATE USER SELLAR
export const createUserController = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const newUser = await createUserService(name, email, password);
    return handleResponse(res, 201, "User created successfully", newUser);
  } catch (error) {
    next(error);
  }
};

//  GET USER BY EMAIL
export const getUserByEmailController = async (req, res, next) => {
  const { email } = req.params;
  try {
    const user = await getUserByEmailService(email);
    if (!user) {
      return handleResponse(res, 404, "User not found");
    }
    return handleResponse(res, 200, "User retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

//  GET USER BY USER_ID
export const getUserByIdController = async (req, res, next) => {
  const user_id = req.user.id;
  try {
    const user = await getUserByIdService(user_id);
    if (!user) {
      return handleResponse(res, 404, "User not found");
    }
    return handleResponse(res, 200, "User retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

//  UPDATE USER
export const updateUserController = async (req, res, next) => {
  const user_id = req.user.id;
  const { name, email } = req.body;

  try {
    const updatedUser = await updateUserService(user_id, name, email);

    if (!updatedUser) {
      return handleResponse(res, 404, "User not found or no fields provided");
    }

    return handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

//  DELETE USER
export const deleteUserController = async (req, res, next) => {
  const user_id = req.user.id;

  try {
    const deletedUser = await deleteUserService(user_id);

    if (!deletedUser) {
      return handleResponse(res, 404, "User not found");
    }

    return handleResponse(res, 200, "User deleted successfully", deletedUser);
  } catch (error) {
    next(error);
  }
};

// UPDATE PASSWORD USER
export const updateUserPasswordController = async (req, res, next) => {
  const user_id = req.user.id;
  const { password } = req.body;

  try {
    const updatedUser = await updateUserPasswordService(user_id, password);

    if (!updatedUser) {
      return handleResponse(res, 404, "User not found");
    }

    return handleResponse(
      res,
      200,
      "Password updated successfully",
      updatedUser
    );
  } catch (error) {
    next(error);
  }
};
