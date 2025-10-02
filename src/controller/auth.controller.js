import { ClientError, globalError } from "shokhijakhon-error-handler";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "../utils/validation/user.validation.js";
import User from "../model/User.js";
import hashService from "../lib/hash.js";
import otpService from "../utils/otp.service.js";
import createNodemailer from "../lib/nodemailer.js";
import {
  resendSchema,
  verifySchema,
} from "../utils/validation/otp.validation.js";
import JwtConfig from "../lib/jwt.js";
import serverConfig from "../config.js";
import cloudinary from "../lib/cloudinary.js";
const { NODE_ENV } = serverConfig;

class AuthController {
  REGISTER = async (req, res) => {
    try {
      const newUser = req.body;
      const validate = registerSchema.validate(newUser, { abortEarly: false });
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const findUser = await User.findOne({ email: newUser.email });
      if (findUser) throw new ClientError("User already exists!", 400);
      const hashing = await hashService.hashPassword(newUser.password);
      if (req.file) {
        newUser.photo = req.file.path;
        newUser.photoId = req.file.filename;
      }

      const { otp, otpTime } = otpService();
      await createNodemailer(newUser.email, otp);

      const createUser = await User.create({
        ...newUser,
        password: hashing,
        otp,
        otpTime,
      });

      return res.status(201).json({
        message: "User successfully created!",
        status: 201,
        id: createUser._id,
        photo: createUser.photo,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };

  VERIFY = async (req, res) => {
    try {
      const data = req.body;
      const validate = verifySchema.validate(data, { abortEarly: false });
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const checkUser = await User.findOne({ email: data.email });
      if (!checkUser) throw new ClientError("User not found !", 400);
      const currentDate = Date.now();
      if (currentDate > checkUser.otpTime) {
        await User.findOneAndUpdate(
          { email: data.email },
          { otp: null, otpTime: null }
        );
        throw new ClientError("OTP expired", 410);
      }
      if (checkUser.otp !== data.otp)
        throw new ClientError("OTP Invalid !", 422);
      const updateUser = await User.findOneAndUpdate(
        { email: data.email },
        { isVerified: true }
      );
      return res.json({ message: "OTP successful !", status: 200 });
    } catch (err) {
      return globalError(err, res);
    }
  };
  RESEND_OTP = async (req, res) => {
    try {
      const data = req.body;
      const validate = resendSchema.validate(data);
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const checkOtp = await User.findOne({ email: data.email });
      if (!checkOtp) throw new ClientError("User not found", 400);
      if (checkOtp.isVerified)
        throw new ClientError("User alredy verified !", 400);
      const { otp, otpTime } = otpService();
      if (checkOtp.otp === null && checkOtp.otpTime === null) {
        await createNodemailer(data.email, otp);
      }
      await User.findOneAndUpdate({ email: data.email }, { otp, otpTime });
      return res.json({
        message: "OTP successfully resend your email !",
        status: 200,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };
  LOGIN = async (req, res) => {
    try {
      const userData = req.body;
      const validate = loginSchema.validate(userData, { abortEarly: false });
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const checkUser = await User.findOne({ email: userData.email });
      if (!checkUser) throw new ClientError("User not found", 404);
      const checkPassword = await hashService.comparePassword(
        userData.password,
        checkUser.password
      );
      if (!checkPassword) throw new ClientError("Incorrect password", 400);
      if (!checkUser.isVerified)
        throw new ClientError("The user is not verified yet!", 403);
      const payload = { user_id: checkUser._id, role: checkUser.role };
      const accessToken = JwtConfig.createAccessToken(payload);
      const refreshToken = JwtConfig.createRefreshToken({
        ...payload,
        userAgent: req.headers["user-agent"],
      });
      checkUser.refreshToken.push({
        token: refreshToken,
        role: checkUser.role,
        userAgent: req.headers["user-agent"],
      });
      await checkUser.save();
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        message: "User successfully logged in!",
        status: 200,
        token: accessToken,
        checkUser
      });
    } catch (err) {
      return globalError(err, res);
    }
  };
  FORGOT_PASSWORD = async (req, res) => {
    try {
      const data = req.body;
      const validate = resendSchema.validate(data);
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const checkUser = await User.findOne({ email: data.email });
      if (!checkUser) throw new ClientError("User not found !", 400);
      await User.findOneAndUpdate(
        { email: data.email },
        { isVerified: false, otp: null, otpTime: null }
      );
      const { otp, otpTime } = otpService();
      await createNodemailer(data.email, otp);
      await User.findOneAndUpdate({ email: data.email }, { otp, otpTime });
      res.json({
        message: "We send new OTP pleace check your email !",
        status: 200,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };
  CHANGE_PASSWORD = async (req, res) => {
    try {
      const data = req.body;
      const validate = changePasswordSchema.validate(data, {
        abortEarly: false,
      });
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const checkUser = await User.findOne({ email: data.email });
      if (!checkUser) throw new ClientError("User not found !", 400);
      const hashing = await hashService.hashPassword(data.new_password);
      await User.findOneAndUpdate({ email: data.email }, { password: hashing });
      res.json({ message: "Password successfuly updated !", status: 200 });
    } catch (err) {
      return globalError(err, res);
    }
  };

  REFRESH_TOKEN = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new ClientError("Invalid token !", 400);
      const checkToken = JwtConfig.verifyRefreshToken(refreshToken);
      if (req.headers["user-agent"] !== checkToken.userAgent)
        throw new ClientError("Invalid token !", 400);
      const findUser = await User.findById(checkToken.user_id);
      if (!findUser) throw new ClientError("Invalid token !", 400);
      req.user = checkToken;
      req.admin = checkToken.role == "admin" ? true : false;
      const payload = { user_id: findUser._id, role: findUser.role };
      const createAccessToken = JwtConfig.createAccessToken(payload);
      res.json({
        message: "Access Token successfully generated !",
        status: 200,
        accessToken: createAccessToken,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };
  LOG_OUT = async (req, res) => {
    try {
      const userToken = req.headers.refreshToken;
      const findToken = await User.findOne({ "refreshToken.token": userToken });
      if (!findToken) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        });
        return res.json({
          message: "User successfully log out !",
          status: 200,
        });
      }
      findToken.refreshToken = findToken.refreshToken.filter(
        (token) => token !== userToken
      );
      await findToken.save();
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
      return res.json({ message: "User successfuly log out !", status: 200 });
    } catch (err) {
      return globalError(err, res);
    }
  };
}

export default new AuthController();
