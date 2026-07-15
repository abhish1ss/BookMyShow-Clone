// Final error-handling middleware: converts thrown errors (ApiError or
// unexpected) into the app-wide { success: false, message } response shape.
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    console.error(err.stack || err);
  }
  res.status(statusCode).send({
    success: false,
    message: statusCode >= 500 ? "Internal server error" : err.message,
  });
};

module.exports = errorHandler;
