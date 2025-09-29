import { ClientError, globalError } from "shokhijakhon-error-handler";
import User from "../model/User.js";
import { isValidObjectId } from "mongoose";
import {
  createUserValidation,
  updateUserValidation,
} from "../utils/validation/user.validation.js";
import hashService from "../lib/hash.js";
import checkUser from "../utils/checkUser.js";
import cloudinary from "../lib/cloudinary.js";

class AdminController {
  GET_ALL = async (req, res) => {
    try {
      const getAdmins = await User.find({ role: "admin" });
      const getSuperAdmins = await User.find({ role: "superAdmin",});
      return res.json(getAdmins, getSuperAdmins);
    } catch (err) {
      return globalError(err, res);
    }
  };
  GET_ADMIN_BY_ID = async (req, res) => {
    try {
      if (req.role !== "superAdmin")
        throw new ClientError("Only superAdmin can get admins", 403);
      const { id } = req.params;
      if (!id) throw new ClientError("ObjectId is reuired", 400);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId", 400);
      const findUser = await User.findById(id);
      if (!findUser) throw new ClientError("User not found", 404);
      return res.json(findUser);
    } catch (err) {
      return globalError(err, res);
    }
  };
  CREATE_ADMIN = async (req, res) => {
    try {
      if (req.role !== "superAdmin")
        throw new ClientError("Only superAdmin can get admins", 403);
      const data = req.body;
      const validate = createUserValidation.validate(data, {
        abortEarly: false,
      });
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const findAdmin = await User.findOne({ email: data.email });
      if (findAdmin) throw new ClientError("Admin already exists", 400);
      data.password = await hashService.hashPassword(data.password);
      const createAdmin = await User.create({ ...data, isVerified: true });
      return res
        .status(201)
        .json({
          message: "Admin successfully created",
          status: 201,
          id: createAdmin._id,
        });
    } catch (err) {
      return globalError(err, res);
    }
  };
  UPDATE_ADMIN = async (req, res) => {
    let uploadedImagePublicId = null;
    try {
      const token = req.headers.token;
      const { id } = req.params;
      if (!id) throw new ClientError("ObjectId is required!", 400);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId!", 400);
      const findAdmin = await User.findById(id);
      if (!findAdmin) throw new ClientError("Admin not found!", 404);
      if (req.role !== "superAdmin") {
        await checkUser(token, id);
      }
      const data = req.body;
      const validate = updateUserValidation.validate(data, {
        abortEarly: false,
      });
      if (validate.error) throw new ClientError(validate.error.message, 400);
      if (data.password) {
        data.password = await hashService.hashPassword(data.password);
      }
      if (req.file) {
        if (findUser.photoId) {
          try {
            await cloudinary.uploader.destroy(findUser.photoId);
          } catch (err) {
            console.error("Failed to delete old avatar from Cloudinary:", err);
          }
        }
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "car_center/avatar",
        });
        uploadedImagePublicId = uploadResult.public_id;
        data.photo = uploadResult.secure_url;
        data.photoId = uploadResult.public_id;
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      return res.json({
        message: "User successfully updated!",
        status: 200,
        id: updatedUser._id,
        photo: updatedUser.photo,
      });
    } catch (err) {
      if (uploadedImagePublicId) {
        try {
          await cloudinary.uploader.destroy(uploadedImagePublicId);
        } catch (destroyErr) {
          console.error(
            "Failed to delete uploaded image from Cloudinary:",
            destroyErr
          );
        }
      }
      return globalError(err, res);
    }
  };
  DELETE_ADMIN = async (req, res) => {
    try {
      const token = req.headers.token;
      const { id } = req.params;
      if (!id) throw new ClientError("ObjectId is required!", 400);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId!", 400);
      const findAdmin = await User.findById(id);
      if (!findAdmin) throw new ClientError("Admin not found!", 404);
      if (req.role !== "superAdmin") {
        await checkUser(token, id);
      }
      if (findAdmin.photoId) {
        try {
          await cloudinary.uploader.destroy(findAdmin.photoId);
        } catch (err) {
          console.error("Failed to delete avatar from Cloudinary:", err);
        }
      }
      await User.findByIdAndDelete(id);

      return res.json({
        message: "User successfully deleted!",
        status: 200,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };
}


export default new AdminController();