import { Schema, model } from "mongoose";

const CarSchema = new Schema(
  {
    brandName: {
      type: String,
      trim: true,
      required: [true, "Brand name is required!"],
    },
    country: {
      type: String,
      trim: true,
      required: [true, "Country is required!"],
    },
    photo: {
      type: String, // Cloudinary secure_url saqlanadi
      trim: true,
      required: true,
    },
    photoId: {
      type: String, // Cloudinary public_id saqlanadi
      required: true,
    },
    modelName: {
      type: String,
      trim: true,
      required: [true, "Model name is required!"],
      unique: true,
    },
    color: {
      type: String,
      trim: true,
      required: [true, "Color is required!"],
    },
    acceleration: {
      type: String,
      trim: true,
      required: [true, "Acceleration is required!"],
    },
    max_speed: {
      type: String,
      trim: true,
      required: [true, "Max speed is required!"],
    },
    fuelType: {
      type: String,
      trim: true,
      required: [true, "Fuel type is required!"],
    },
    transmission: {
      type: String,
      trim: true,
      required: [true, "Transmission is required!"],
    },
    car_hp: {
      type: String,
      required: [true, "Car horsepower is required!"],
    },
    motor_liter: {
      type: String,
      trim: true,
      required: [true, "Motor liter is required!"],
    },
    distance: {
      type: String,
      required: [true, "Distance is required!"],
    },
    year: {
      type: Number,
      required: [true, "Year is required!"],
    },
    count: {
      type: Number,
      required: [true, "Count is required!"],
    },
    price: {
      type: Number,
      required: [true, "Price is required!"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required!"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("cars", CarSchema);
