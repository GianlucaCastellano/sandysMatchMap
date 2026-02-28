function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Interner Serverfehler";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  });
}

module.exports = errorHandler;
