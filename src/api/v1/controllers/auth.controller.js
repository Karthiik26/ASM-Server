import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../../config/database.js";
import { handleResponse } from "../../../utils/response.helper.js";
import { ENV } from "../../../config/env.config.js";
import redisClient from "../../../config/redis.js";

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) return handleResponse(res, 404, "User not found");

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return handleResponse(res, 401, "Invalid credentials");

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Cannot be accessed by JS
      secure: ENV.NODE_ENV === "production", // Only over HTTPS in prod
      sameSite: "none", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return handleResponse(res, 200, "Login successful", { token, user });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return handleResponse(res, 400, "No token provided");
    }

    // Decode token to get expiration
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return handleResponse(res, 400, "Invalid token");
    }

    // Calculate TTL (time to live) in seconds
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    if (ttl > 0) {
      // Store token in Redis blacklist
      await redisClient.set(`blacklist_${token}`, "true", { EX: ttl });
    }

    // Clear cookie if using cookies
    if (req.cookies?.token) {
      res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
    }

    return handleResponse(res, 200, "Logout successful");
  } catch (err) {
    next(err);
  }
};
