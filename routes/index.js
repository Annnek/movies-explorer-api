const router = require("express").Router();
const NotFoundError = require("../errors/NotFoundError");
const usersRouter = require("./users");
const moviesRouter = require("./movies");

const { loginUser, registrationUser } = require("../controllers/users");

const {
  loginUserJoi,
  registrationUserJoi,
} = require("../middlewares/validation");

const authMiddleware = require("../middlewares/auth");

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

router.post("/signin", loginUserJoi, loginUser);
router.post("/signup", registrationUserJoi, registrationUser);

router.use(authMiddleware);
router.use("/users", usersRouter);
router.use("/movies", moviesRouter);
router.use("/*", (req, res, next) =>
  next(new NotFoundError("Запись не найдена.")),
);

module.exports = router;
