import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Category Name is required!"],
      unique: true,
    },
    logo: {
      type: String,
      trim: true,
      required: true,
    },
    logoId: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export default model("category", CategorySchema);
