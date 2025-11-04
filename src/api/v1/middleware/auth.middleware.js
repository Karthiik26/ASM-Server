import jwt from "jsonwebtoken";
import redisClient from "../../../config/redis.js";
import { pool } from "../../../config/database.js";
import { ENV } from "../../../config/env.config.js";
import { handleResponse } from "../../../utils/response.helper.js";

const JWT_SECRET = ENV.JWT_SECRET;

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const userQuery = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [decoded.user_id]
    );

    if (!userQuery.rows[0]) {
      return handleResponse(res, 401, "User Not Found");
    }

    req.user = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: insufficient role" });
    }
    next();
  };
};
