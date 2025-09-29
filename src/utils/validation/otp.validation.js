import Joi from "joi";

const email = Joi.string()
.email()
.required()
.messages({
    "string.base" : "Email must be a string",
    "string.email" : "Email must be a valid email adress",
    "string.empty" : "Email cannot be ampty",
    "any.required" : "Email is required"
}) ;

const otp = Joi.string()
.length(6)
.pattern(/^[0-9]+$/)
.required()
.messages({
    "string.base" : "OTP must be a string",
    "string.length" : "OTP must be exactly 6 digits" ,
    "string.pattern.base" : "OTP, must contain only digits",
    "any.required" : "OTP is required "
});

export const verifySchema = Joi.object({email, otp});
export const resendSchema = Joi.object({email});