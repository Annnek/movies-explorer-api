const Movie = require("../models/movie");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .populate("owner", "_id")
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const { _id } = req.user;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: _id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании фильма",
          ),
        );
      } else {
        next(err);
      }
    });
};

// const deleteMovie = (req, res, next) => {
//   // const currentUserId = req.user._id;
//   // const movieId = req.params._id;

//   const { id: movieId } = req.params;
//   const { _id: userId } = req.user;

//   Movie.findById(movieId)
//     .then((movie) => {
//       if (!movie) throw new NotFoundError("Фильм с данным id не найден");

//       const { owner: movieOwnerId } = movie;
//       if (movieOwnerId.valueOf() !== userId)
//         throw new ForbiddenError("Вы не можете удалить чужой фильм");

//       movie
//         .deleteOne()
//         .then(() => res.send({ message: "Фильм удалён" }))
//         .catch(next);
//     })
//     .catch(next);
// };

const deleteMovie = (req, res, next) => {
  const currentUserId = req.user._id;
  const movieId = req.params._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError("Фильм с данным id не найден");
      }

      // Проверка, что текущий пользователь является владельцем карточки
      const { owner: movieOwnerId } = movie;

      if (movieOwnerId.valueOf() !== currentUserId) {
        throw new ForbiddenError("Вы не можете удалить чужой фильм");
      }
      return Movie.findByIdAndRemove(movieId);
    })
    .then((deletedMovie) => {
      if (!deletedMovie) {
        throw new NotFoundError("Карточка не найдена");
      }
      return res.send(deletedMovie);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
