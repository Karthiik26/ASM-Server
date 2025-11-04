import express from "express";
import {
  productsDownloadByLoggedUserController,
  uploadFileExcel,
} from "../controllers/fileController.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/filter.middleware.js";

const v1UploadDownloadrouter = express.Router();

v1UploadDownloadrouter.use(authenticateUser);

// Upload CSV/XLSX
v1UploadDownloadrouter.post("/upload", upload.single("file"), uploadFileExcel);

// Download XLSX
v1UploadDownloadrouter.get("/download", productsDownloadByLoggedUserController);

export default v1UploadDownloadrouter;
