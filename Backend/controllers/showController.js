const Show = require("../models/showSchema");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const addShow = asyncHandler(async (req, res) => {
  const newShow = new Show(req.body);
  await newShow.save();
  res.send({
    success: true,
    message: "New show has been added!",
  });
});

const deleteShow = asyncHandler(async (req, res) => {
  const showId = req.params.showId;
  const show = await Show.findByIdAndDelete(showId);
  if (!show) {
    throw new ApiError(404, "Show not found");
  }
  res.send({
    success: true,
    message: "The show has been deleted!",
  });
});

const updateShow = asyncHandler(async (req, res) => {
  const show = await Show.findByIdAndUpdate(req.body.showId, req.body);
  if (!show) {
    throw new ApiError(404, "Show not found");
  }
  res.send({
    success: true,
    message: "The show has been updated!",
  });
});

const getAllShowsByTheatre = asyncHandler(async (req, res) => {
  const shows = await Show.find({ theatre: req.body.theatreId }).populate(
    "movie"
  );
  res.send({
    success: true,
    message: "All shows are fetched",
    data: shows,
  });
});

const getAllTheatersByMovie = asyncHandler(async (req, res) => {
  const { movie, date } = req.body;
  const shows = await Show.find({ movie, date }).populate("theatre");

  let uniqueTheatre = [];
  shows.forEach((show) => {
    let isTheatre = uniqueTheatre.find(
      (theatre) => theatre._id === show.theatre._id
    );
    if (!isTheatre) {
      let showsOfThisTheatre = shows.filter(
        (showObj) => showObj.theatre._id === show.theatre._id
      );
      uniqueTheatre.push({
        ...show.theatre._doc,
        shows: showsOfThisTheatre,
      });
    }
  });

  res.send({
    success: true,
    message: "All Theatres are fetched",
    data: uniqueTheatre,
  });
});

const getShowsById = asyncHandler(async (req, res) => {
  const shows = await Show.findById(req.body.showId)
    .populate("movie")
    .populate("theatre");
  if (!shows) {
    throw new ApiError(404, "Show not found");
  }
  res.send({
    success: true,
    message: "All shows are fetched",
    data: shows,
  });
});

module.exports = {
  addShow,
  deleteShow,
  updateShow,
  getAllShowsByTheatre,
  getAllTheatersByMovie,
  getShowsById,
};
