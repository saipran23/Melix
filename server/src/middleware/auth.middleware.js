export const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const optionalAuth = (req, res, next) => {
  // Useful if you want optional user context
  next();
};