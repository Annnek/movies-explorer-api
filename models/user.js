const mongoose = require("mongoose");
const validator = require("validator");

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
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
