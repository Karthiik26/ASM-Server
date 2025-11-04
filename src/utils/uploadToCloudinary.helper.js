import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (file, folder = "uploads") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto", // auto-detects image/video/pdf etc.
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Cloudinary upload failed");
  }
};
