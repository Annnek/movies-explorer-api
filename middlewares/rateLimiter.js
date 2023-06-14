const rateLimit = require("express-rate-limit");

// Лимит запросов: 100 запросов в течение 1 часа (3600000 миллисекунд)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 100, // максимальное количество запросов
  message: "Превышено количество запросов с вашего IP. Попробуйте позже.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
