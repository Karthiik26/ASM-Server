import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".csv", ".xlsx"];
  const ext = path.extname(file.originalname);
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV or XLSX files are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });
export const uploadImage = multer({ storage });
