

export const errorHandler = (err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};