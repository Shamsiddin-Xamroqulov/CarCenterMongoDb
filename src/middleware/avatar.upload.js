import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "car_center/avatar",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only jpg, jpeg and png file is allowed"), false);
};

const limits = { fileSize: 2 * 1024 * 1024 };

const uploadAvatar = multer({ storage, fileFilter, limits });

export default uploadAvatar;
