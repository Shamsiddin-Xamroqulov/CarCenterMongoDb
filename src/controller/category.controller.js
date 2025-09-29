import { ClientError, globalError } from "shokhijakhon-error-handler";
import Category from "../model/Category.js";
import { isValidObjectId } from "mongoose";
import categorySchema from "../utils/validation/category.validation.js";
import { v2 as cloudinary } from "cloudinary";

class CategoryController {
  GET_ALL = async (req, res) => {
    try {
      const getCategory = await Category.find();
      return res.json(getCategory);
    } catch (err) {
      return globalError(err, res);
    }
  };
  GET_CATEGORY_BY_ID = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) throw new ClientError("Object id not found !", 404);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId", 400);
      const findCategory = await Category.findById(id);
      return res.json(findCategory);
    } catch (err) {
      return globalError(err, res);
    }
  };
  CREATE_CATEGORY = async (req, res) => {
    try {
      if (req.role !== "admin" && req.role !== "superAdmin") {
        throw new ClientError("Only admins can create users!", 403);
      }
      if (!req.file) throw new ClientError("Logo is required!", 400);
      const categoryData = req.body;
      const validate = categorySchema.validate(categoryData, {
        abortEarly: false,
      });
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const checkCategory = await Category.findOne({ name: categoryData.name });
      if (checkCategory) throw new ClientError("Category already exists!", 400);
      categoryData.logo = req.file.path;
      categoryData.logoId = req.file.filename;
      const createCategory = await Category.create(categoryData);
      return res.status(201).json({
        message: "Category successfully created!",
        status: 201,
        id: createCategory._id,
        logoUrl: createCategory.logo,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };
  UPDATE_CATEGORY = async (req, res) => {
    try {
      if (!req.admin && req.role !== "superAdmin")
        throw new ClientError("Only admins can update category!", 403);
      const { id } = req.params;
      if (!id) throw new ClientError("ObjectId not found!", 404);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId", 400);
      const findCategory = await Category.findById(id);
      if (!findCategory) throw new ClientError("Category not found!", 404);
      const data = req.body;
      const validate = categorySchema.validate(data, { abortEarly: false });
      if (validate.error) throw new ClientError(validate.error.message, 400);
      if (req.file) {
        if (findCategory.logoId) {
          try {
            await cloudinary.uploader.destroy(findCategory.logoId);
          } catch (err) {
            console.error("Failed to delete old logo from Cloudinary:", err);
          }
        }
        data.logo = req.file.path;
        data.logoId = req.file.filename;
      }
      const updateCategory = await Category.findByIdAndUpdate(id, data, {
        new: true,
      });
      return res.json({
        message: "Category successfully updated!",
        status: 200,
        id: updateCategory._id,
        logoUrl: updateCategory.logo,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };

  DELETE_CATEGORY = async (req, res) => {
    try {
      if (!req.admin && req.role !== "superAdmin")
        throw new ClientError("Only admins can delete categories!", 403);
      const { id } = req.params;
      if (!id) throw new ClientError("ObjectId is required!", 400);
      if (!isValidObjectId(id)) throw new ClientError("Invalid ObjectId!", 400);
      const findCategory = await Category.findById(id);
      if (!findCategory) throw new ClientError("Category not found!", 404);
      if (findCategory.logoId) {
        try {
          await cloudinary.uploader.destroy(findCategory.logoId);
        } catch (err) {
          console.error("Failed to delete logo from Cloudinary:", err);
        }
      }
      await Category.findByIdAndDelete(id);
      return res.json({
        message: "Category successfully deleted!",
        status: 200,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };
}

export default new CategoryController();
