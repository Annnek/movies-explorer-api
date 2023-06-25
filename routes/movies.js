const moviesRouter = require("express").Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

const { createMovieJoi, deleteMovieJoi } = require("../middlewares/validation");

moviesRouter.get("/", getMovies);
moviesRouter.post("/", createMovieJoi, createMovie);
moviesRouter.delete("/:_id", deleteMovieJoi, deleteMovie);

module.exports = moviesRouter;
