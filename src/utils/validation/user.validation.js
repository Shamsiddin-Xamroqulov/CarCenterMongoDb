import Joi from "joi";

export const registerSchema = Joi.object({
  first_name: Joi.string().min(2).max(30).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must not exceed 30 characters",
    "any.required": "First name is required",
  }),

  last_name: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name must not exceed 30 characters",
    "any.required": "Last name is required",
  }),

  phone: Joi.string()
    .pattern(/^\+?\d{9,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be valid (e.g., +998901234567)",
      "any.required": "Phone number is required",
    }),

  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])")
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 50 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
      "any.required": "Password is required",
    }),

  role: Joi.string().valid("user", "admin", "superAdmin").default("user").messages({
    "any.only": "You cannot assign role other than 'user' during registration",
  }),
});

export const updateSchema = Joi.object({
  first_name: Joi.string().min(2).max(30).messages({
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must not exceed 30 characters",
  }),

  last_name: Joi.string().min(2).max(30).messages({
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name must not exceed 30 characters",
  }),

  phone: Joi.string()
    .pattern(/^\+?\d{9,15}$/)
    .messages({
      "string.pattern.base": "Phone number must be valid (e.g., +998901234567)",
    }),

  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])")
    )
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 50 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
    }),
}).min(1);

export const changePasswordSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  new_password: Joi.string().min(6).max(30).required().messages({
    "string.empty": "New password cannot be empty",
    "string.min": "New password must be at least 6 characters long",
    "string.max": "New password cannot be longer than 30 characters",
    "any.required": "New password is required",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])")
    )
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 50 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
    }),
});

export const createUserValidation = Joi.object({
  first_name: Joi.string().min(2).max(30).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must not exceed 30 characters",
    "any.required": "First name is required",
  }),

  last_name: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name must not exceed 30 characters",
    "any.required": "Last name is required",
  }),

  phone: Joi.string()
    .pattern(/^\+?\d{9,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be valid (e.g., +998901234567)",
      "any.required": "Phone number is required",
    }),

  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  photo: Joi.string().optional().messages({
    "string.empty": "Photo URL cannot be empty!",
  }),

  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])")
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 50 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
      "any.required": "Password is required",
    }),

  role: Joi.string().valid("user", "admin", "superAdmin").default("user").messages({
    "any.only": "You cannot assign role other than 'user' during registration",
  }),
});

export const updateUserValidation = Joi.object({
  first_name: Joi.string().trim().optional().messages({
    "string.empty": "First name cannot be empty!",
  }),
  last_name: Joi.string().trim().optional().messages({
    "string.empty": "Last name cannot be empty!",
  }),
  email: Joi.string().email().optional().messages({
    "string.empty": "Email cannot be empty!",
    "string.email": "Invalid email format!",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters!",
    "string.empty": "Password cannot be empty!",
  }),
  phone: Joi.string().trim().optional().messages({
    "string.empty": "Phone number cannot be empty!",
  }),
  photo: Joi.string().optional().messages({
    "string.empty": "Photo URL cannot be empty!",
  }),
}).min(1);
