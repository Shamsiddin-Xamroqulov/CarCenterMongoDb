import Joi from "joi";

const carValidation = Joi.object({
  brandName: Joi.string().trim().required().messages({
    "string.empty": "Brand name is required!",
    "any.required": "Brand name is required!",
  }),
  country: Joi.string().trim().required().messages({
    "string.empty": "Country is required!",
    "any.required": "Country is required!",
  }),
  modelName: Joi.string().trim().required().messages({
    "string.empty": "Model name is required!",
    "any.required": "Model name is required!",
  }),
  color: Joi.string().trim().required().messages({
    "string.empty": "Color is required!",
    "any.required": "Color is required!",
  }),
  acceleration: Joi.string().trim().required().messages({
    "string.empty": "Acceleration is required!",
    "any.required": "Acceleration is required!",
  }),
  max_speed: Joi.string().trim().required().messages({
    "string.empty": "Max speed is required!",
    "any.required": "Max speed is required!",
  }),
  fuelType: Joi.string().trim().required().messages({
    "string.empty": "Fuel type is required!",
    "any.required": "Fuel type is required!",
  }),
  transmission: Joi.string().trim().required().messages({
    "string.empty": "Transmission is required!",
    "any.required": "Transmission is required!",
  }),
  car_hp: Joi.string().trim().required().messages({
    "string.empty": "Car horsepower is required!",
  }),
  motor_liter: Joi.string().trim().required().messages({
    "string.empty": "Motor liter is required!",
    "any.required": "Motor liter is required!",
  }),
  year: Joi.number().integer().required().messages({
    "number.base": "Year must be a number!",
    "number.integer": "Year must be an integer!",
    "any.required": "Year is required!",
  }),
  distance: Joi.string().trim().required().messages({
    "string.empty": "Distance is required!",
  }),
  count: Joi.number().integer().required().messages({
    "number.base": "Count must be a number!",
    "number.integer": "Count must be an integer!",
    "any.required": "Count is required!",
  }),
  price: Joi.number().required().messages({
    "number.base": "Price must be a number!",
    "any.required": "Price is required!",
  }),
  description: Joi.string().trim().required().messages({
    "string.empty": "Description is required!",
    "any.required": "Description is required!",
  }),
});

export const updateCarValidation = Joi.object({
  brandName: Joi.string().trim().optional().messages({
    "string.empty": "Brand name cannot be empty!",
  }),
  country: Joi.string().trim().optional().messages({
    "string.empty": "Country cannot be empty!",
  }),
  modelName: Joi.string().trim().optional().messages({
    "string.empty": "Model name cannot be empty!",
  }),
  color: Joi.string().trim().optional().messages({
    "string.empty": "Color cannot be empty!",
  }),
  acceleration: Joi.string().trim().optional().messages({
    "string.empty": "Acceleration cannot be empty!",
  }),
  max_speed: Joi.string().trim().optional().messages({
    "string.empty": "Max speed cannot be empty!",
  }),
  fuelType: Joi.string().trim().optional().messages({
    "string.empty": "Fuel type cannot be empty!",
  }),
  transmission: Joi.string().trim().optional().messages({
    "string.empty": "Transmission cannot be empty!",
  }),
  car_hp: Joi.string().trim().optional().messages({
    "string.empty": "Car horsepower cannot be empty!",
  }),
  motor_liter: Joi.string().trim().optional().messages({
    "string.empty": "Motor liter cannot be empty!",
  }),
  year: Joi.number().integer().optional().messages({
    "number.base": "Year must be a number!",
    "number.integer": "Year must be an integer!",
  }),
  distance: Joi.string().trim().optional().messages({
    "string.empty": "Distance cannot be empty!",
  }),
  count: Joi.number().integer().optional().messages({
    "number.base": "Count must be a number!",
    "number.integer": "Count must be an integer!",
  }),
  price: Joi.number().optional().messages({
    "number.base": "Price must be a number!",
  }),
  description: Joi.string().trim().optional().messages({
    "string.empty": "Description cannot be empty!",
  }),
}).min(1);

export default carValidation;
