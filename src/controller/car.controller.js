import { ClientError, globalError } from "shokhijakhon-error-handler";
import Car from "../model/Car.js";
import { isValidObjectId } from "mongoose";
import carValidation, {
  updateCarValidation,
} from "../utils/validation/car.validation.js";
import cloudinary from "../lib/cloudinary.js";

class CarsController {
  GET_ALL = async (req, res) => {
    try {
      const cars = await Car.find();
      return res.json(cars);
    } catch (err) {
      return globalError(err, res);
    }
  };

  GET_CAR_BY_ID = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) throw new ClientError("Object Id not found!", 404);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId", 400);

      const findCar = await Car.findById(id);
      if (!findCar) throw new ClientError("Car not found!", 404);

      return res.json(findCar);
    } catch (err) {
      return globalError(err, res);
    }
  };

  CREATE_CAR = async (req, res) => {
    let uploadedImagePublicId = null;
    try {
      if (req.role !== "admin" && req.role !== "superAdmin") {
        throw new ClientError("Only admins can create users!", 403);
      }
      if (!req.file) throw new ClientError("Photo is required!", 400);
      const data = req.body;
      const validation = carValidation.validate(data, { abortEarly: false });
      if (validation.error)
        throw new ClientError(validation.error.message, 400);
      const findCar = await Car.findOne({ modelName: data.modelName });
      if (findCar) throw new ClientError("Car already exists!", 400);
      data.photo = req.file.path;
      data.photoId = req.file.filename;

      const createCar = await Car.create(data);

      return res.status(201).json({
        message: "Car successfully created!",
        status: 201,
        id: createCar._id,
        imageUrl: createCar.photo,
      });
    } catch (err) {
      if (uploadedImagePublicId) {
        try {
          await cloudinary.uploader.destroy(uploadedImagePublicId);
        } catch (destroyErr) {
          console.error("Failed to delete image from Cloudinary:", destroyErr);
        }
      }
      return globalError(err, res);
    }
  };

  UPDATE_CAR = async (req, res) => {
    let uploadedImagePublicId = null;
    try {
      if (!req.admin && req.role !== "superAdmin")
        throw new ClientError("Only admins can update cars!", 403);
      const { id } = req.params;
      if (!id) throw new ClientError("ObjectId is required!", 400);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId!", 400);

      const findCar = await Car.findById(id);
      if (!findCar) throw new ClientError("Car not found!", 404);

      const data = req.body;
      const validation = updateCarValidation.validate(data, {
        abortEarly: false,
      });
      if (validation.error)
        throw new ClientError(validation.error.message, 400);

      if (req.file) {
        if (findCar.photoId) {
          try {
            await cloudinary.uploader.destroy(findCar.photoId);
          } catch (err) {
            console.error(
              "Failed to delete old car image from Cloudinary:",
              err
            );
          }
        }
        data.photo = req.file.path;
        data.photoId = req.file.filename;
      }

      const updatedCar = await Car.findByIdAndUpdate(id, data, { new: true });

      return res.json({
        message: "Car successfully updated!",
        status: 200,
        id: updatedCar._id,
        imageUrl: updatedCar.photo,
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
  DELETE_CAR = async (req, res) => {
    try {
      if (req.role !== "superAdmin")
        throw new ClientError("Only suparAdmins can delete cars!", 403);
      const { id } = req.params;
      if (!id) throw new ClientError("ObjectId is required!", 400);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId!", 400);
      const findCar = await Car.findById(id);
      if (!findCar) throw new ClientError("Car not found!", 404);
      if (findCar.photoId) {
        try {
          await cloudinary.uploader.destroy(findCar.photoId);
        } catch (err) {
          console.error("Failed to delete image from Cloudinary:", err);
        }
      }
      await Car.findByIdAndDelete(id);
      return res.json({
        message: "Car successfully deleted!",
        status: 200,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };
}

export default new CarsController();
