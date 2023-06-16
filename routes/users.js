const usersRouter = require("express").Router();

const { getUserInfo, updateProfileUser } = require("../controllers/users");

const { updateProfileUserJoi } = require("../middlewares/validation");

usersRouter.get("/me", getUserInfo);
usersRouter.patch("/me", updateProfileUserJoi, updateProfileUser);

module.exports = usersRouter;
