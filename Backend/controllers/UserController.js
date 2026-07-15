const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmailHelper = require("../utils/emailHelper");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const registerUser = asyncHandler(async (req, res) => {
  const userExists = await userModel.findOne({ email: req?.body?.email });

  if (userExists) {
    throw new ApiError(409, "User Already Exists");
  }
  // hash the password
  const salt = await bcrypt.genSalt(10); // 2^10
  const hashedPassword = await bcrypt.hash(req?.body?.password, salt);
  req.body.password = hashedPassword;
  const newUser = new userModel(req?.body);
  await newUser.save();

  res.send({
    success: true,
    message: "Registration Successfull, Please Login",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const user = await userModel.findOne({ email: req?.body?.email });

  if (!user) {
    throw new ApiError(404, "User does not exist. Please register");
  }

  const validatePassword = await bcrypt.compare(
    req?.body?.password,
    user.password
  );

  if (!validatePassword) {
    throw new ApiError(401, "Please enter valid password");
  }
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  // httpOnly keeps the JWT out of reach of client-side scripts (XSS)
  res.cookie("tokenForBMS", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.send({
    success: true,
    message: "You've Successfully Logged In",
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("tokenForBMS", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  res.send({
    success: true,
    message: "Logged out successfully",
  });
});

const currentUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.body.userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.send({
    success: true,
    message: "User Details Fetched Successfully",
    data: user,
  });
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (email == undefined) {
    throw new ApiError(400, "Please enter the email for forget Password");
  }
  const user = await userModel.findOne({ email: email });
  if (user == null) {
    throw new ApiError(404, "user not found");
  }
  if (user.otp != undefined && user.otpExpiry > Date.now()) {
    throw new ApiError(400, "Please use otp sent on mail");
  }
  const otp = Math.floor(Math.random() * 10000 + 90000);
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();
  await EmailHelper("otp.html", user.email, {
    name: user.name,
    otp: otp,
  });
  res.status(200).json({
    success: true,
    message: "otp has been sent",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, otp } = req.body;
  if (password == undefined || otp == undefined) {
    throw new ApiError(400, "invalid request");
  }
  const user = await userModel.findOne({ otp: otp });
  if (user == null) {
    throw new ApiError(404, "user not found");
  }
  if (Date.now() > user.otpExpiry) {
    throw new ApiError(401, "otp expired");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req?.body?.password, salt);
  user.password = hashedPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: "password reset successfully",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  forgetPassword,
  resetPassword,
};
