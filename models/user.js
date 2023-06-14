const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UnauthorizedError = require("../errors/UnauthorizedError");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Введите корректный адрес электронной почты",
      },
    },
    password: {
      type: String,
      required: true,
      select: false, // чтобы API не возвращал хеш пароля
    },
    name: {
      type: String,
      required: true,
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: "Имя пользователя должно быть длиной от 2 до 30 символов",
      },
      default: "Ваше имя",
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select("+password")
          .then((user) => {
            if (!user) {
              return Promise.reject(
                new UnauthorizedError("Неправильные почта или пароль"),
              );
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                return Promise.reject(
                  new UnauthorizedError("Неправильные почта или пароль"),
                );
              }
              return user;
            });
          });
      },
    },
  },
);

userSchema.statics.findUserByCredentials = function _(email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user)
        return Promise.reject(
          new UnauthorizedError("Неправильные почта или пароль"),
        );
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched)
          return Promise.reject(
            new UnauthorizedError("Неправильные почта или пароль"),
          );
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
