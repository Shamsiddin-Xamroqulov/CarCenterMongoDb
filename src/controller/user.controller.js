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

class UserController {
  GET_ALL = async (req, res) => {
    try {
      const getUsers = await User.find({ role: "user" });
      return res.json(getUsers);
    } catch (err) {
      return globalError(err, res);
    }
  };
  GET_USER_BY_ID = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) throw new ClientError("Object Id is required !", 400);
      if (!isValidObjectId(id))
        throw new ClientError("Invalid ObjectId !", 400);
      const findUser = await User.findById(id);
      if (!findUser) throw new ClientError("User not found !", 404);
      return res.json(findUser);
    } catch (err) {
      return globalError(err, res);
    }
  };
  CREATE_USER = async (req, res) => {
    try {
      if (req.role !== "admin" && req.role !== "superAdmin") {
        throw new ClientError("Only admins can create users!", 403);
      }
      const userData = req.body;
      const validate = createUserValidation.validate(userData, {
        abortEarly: false,
      });
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const findUser = await User.findOne({ email: userData.email });
      if (findUser) throw new ClientError("User already exists!", 409);
      userData.password = await hashService.hashPassword(userData.password);
      const createUser = await User.create({
        ...userData,
        isVerified: true,
      });
      return res.status(201).json({
        message: "User successfully created!",
        status: 201,
        id: createUser._id,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };
  UPDATE_USER = async (req, res) => {
    let uploadedImagePublicId = null;
    try {
      const token = req.headers.token;
      const { id } = req.params;
      if (!id) throw new ClientError("ObjectId is required!", 400);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId!", 400);
      const findUser = await User.findById(id);
      if (!findUser) throw new ClientError("User not found!", 404);
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
        updatedUser
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
  DELETE_USER = async (req, res) => {
    try {
      const token = req.headers.token;
      const { id } = req.params;
      if (!id) throw new ClientError("ObjectId is required!", 400);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId!", 400);
      const findUser = await User.findById(id);
      if (!findUser) throw new ClientError("User not found!", 404);
      if (req.role !== "superAdmin") {
        await checkUser(token, id);
      }
      if (findUser.photoId) {
        try {
          await cloudinary.uploader.destroy(findUser.photoId);
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

export default new UserController();
