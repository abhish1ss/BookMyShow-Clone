const MovieModel = require("../models/movieSchema");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const addMovie = asyncHandler(async (req, res) => {
  const duplicate = await MovieModel.findOne({
    movieName: req?.body?.movieName,
  });
  if (duplicate) {
    throw new ApiError(409, "A movie with this name already exists");
  }
  const newMovie = new MovieModel(req?.body);
  await newMovie.save();
  res.send({
    success: true,
    message: "New Movie has been Added",
  });
});

const getAllMovies = asyncHandler(async (req, res) => {
  const allMovies = await MovieModel.find();
  res.send({
    success: true,
    message: "All movies has been fetched",
    data: allMovies,
  });
});

const updateMovie = asyncHandler(async (req, res) => {
  const movie = await MovieModel.findByIdAndUpdate(
    req?.body?.movieId,
    req.body,
    { new: true }
  );
  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }
  res.send({
    success: true,
    message: "The Movie has been Updated",
    data: movie,
  });
});

const deleteMovie = asyncHandler(async (req, res) => {
  const movieId = req.params.movieId;
  const movie = await MovieModel.findByIdAndDelete(movieId);
  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }
  res.send({
    success: true,
    message: "The Movie has been deleted",
  });
});

const getMovieById = asyncHandler(async (req, res) => {
  const movie = await MovieModel.findById(req.params.id);
  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }
  res.send({
    success: true,
    message: "Movie fetched successfully!",
    data: movie,
  });
});

module.exports = {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
};
