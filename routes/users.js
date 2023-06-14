const usersRouter = require("express").Router();

const { getUserById, updateProfileUser } = require("../controllers/users");

const {
  getUserByIdJoi,
  updateProfileUserJoi,
} = require("../middlewares/validation");

usersRouter.get("/me", getUserByIdJoi, getUserById);
usersRouter.patch("/me", updateProfileUserJoi, updateProfileUser);

module.exports = usersRouter;
