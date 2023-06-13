const errorHandler = (error, req, res, next) => {
  const { status = 500, message } = error;
  res.status(status).send({
    message:
      status === 500
        ? "На сервере произошла ошибка, попробуйте позже"
        : message,
  });
  next(error);
};

module.exports = errorHandler;
