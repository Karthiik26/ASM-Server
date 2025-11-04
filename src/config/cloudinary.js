import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.config.js";

cloudinary.config({
  cloud_name: ENV.ClOUD_NAME,
  api_key: ENV.ClOUD_API_KEY,
  api_secret: ENV.ClOUD_API_SECRET_KEY,
});

export default cloudinary;
