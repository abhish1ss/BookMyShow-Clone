const Theatre = require("../models/theatreSchema");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const addTheatre = asyncHandler(async (req, res) => {
  const newTheatre = new Theatre(req.body);
  await newTheatre.save();
  res.send({
    success: true,
    message: "New theatre has been added!",
  });
});

const updateTheatre = asyncHandler(async (req, res) => {
  const theatre = await Theatre.findByIdAndUpdate(
    req.body.theatreId,
    req.body,
    { new: true }
  );
  if (!theatre) {
    throw new ApiError(404, "Theatre not found");
  }
  res.send({
    success: true,
    message: "Theatre has been updated!",
  });
});

const deleteTheatre = asyncHandler(async (req, res) => {
  const theatreId = req.params.theatreId;
  const theatre = await Theatre.findByIdAndDelete(theatreId);
  if (!theatre) {
    throw new ApiError(404, "Theatre not found");
  }
  res.send({
    success: true,
    message: "The theatre has been deleted!",
  });
});

const getAllTheatres = asyncHandler(async (req, res) => {
  const allTheatre = await Theatre.find().populate("owner");
  res.send({
    success: true,
    message: "All Theatres Fetched !",
    data: allTheatre,
  });
});

const getAllTheatresByOwner = asyncHandler(async (req, res) => {
  const allTheatres = await Theatre.find({ owner: req.body.userId });
  res.send({
    success: true,
    message: "All theatres fetched successfully!",
    data: allTheatres,
  });
});

module.exports = {
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getAllTheatres,
  getAllTheatresByOwner,
};
