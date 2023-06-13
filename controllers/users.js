const bcrypt = require("bcryptjs"); // Добавляем модуль bcryptjs для хеширования пароля
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET, NODE_ENV } = require("../utils/config");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

// Контроллер для регистрации юзера
function registrationUser(req, res, next) {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
      }),
    )
    .then((user) => {
      const { _id } = user;

      return res.status(201).send({
        email,
        name,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError("Пользователь с таким email уже зарегистрирован"),
        );
      } else if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при регистрации пользователя",
          ),
        );
      } else {
        next(err);
      }
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign(
          { userId },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          {
            expiresIn: "7d",
          },
        );
        return res.send({ token });
      }
      throw new UnauthorizedError("Неправильные почта или пароль");
    })
    .catch(next);
}

// Поиск юзера по id
const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь с таким id не найден");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Неправильный id"));
      }
      return next(err);
    });
};

// Контроллер для обновления профиля
const updateProfileUser = (req, res, next) => {
  const { userId } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError("Пользователь с таким id не найден");
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при обновлении профиля пользователя",
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  registrationUser,
  loginUser,
  getUserById,
  updateProfileUser,
};
