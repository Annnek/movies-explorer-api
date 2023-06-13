const jwt = require("jsonwebtoken");
const { JWT_SECRET, NODE_ENV } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Вы не зарегистрированы"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
  } catch (err) {
    return next(new UnauthorizedError("Вам нужно зарегистрироваться"));
  }
  req.user = payload;
  return next();
};

module.exports = authMiddleware;
