import {v2 as cloudinary} from "cloudinary";
import multer from "multer";
import serverConfig from "../config.js";
const {API_KEY, CLOUD_NAME, API_SECRET} = serverConfig;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

export default cloudinary;