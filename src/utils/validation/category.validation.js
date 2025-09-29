import Joi from "joi";

const categorySchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Category Name is required!",
    "any.required": "Category Name is required!",
  }),
});

export default categorySchema;
