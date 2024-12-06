const createError = require("http-errors");

function errorHandler(err, req, res, next) {
  if (createError.isHttpError(err)) {
    res.status(err.status || 500).json({
      message: err.message,
      error: err.status,
    });
  } else {
    res.status(500).json({
      message: "An unexpected error occurred",
      error: err.message,
    });
  }
}

module.exports = errorHandler;
