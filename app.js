require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const { errors } = require("celebrate");

const helmet = require("helmet");

const cors = require("cors");
// const cors = require("./utils/cors");

const limiter = require("./middlewares/rateLimiter");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const routes = require("./routes/index");

const errorHandler = require("./middlewares/errorHandler");

const { PORT, MONGO_URL } = require("./utils/config");

mongoose.connect(MONGO_URL);

const app = express();

// app.use(cors);

const allowedCors = [
  "https://bestfilms.nomoredomains.rocks",
  "http://bestfilms.nomoredomains.rocks",
  "localhost:3000",
  "http://localhost",
  "http://localhost:3001",
  "http://localhost:3000",
];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

// подключаем логгер запросов
app.use(requestLogger);

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// подключаем логгер ошибок
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
