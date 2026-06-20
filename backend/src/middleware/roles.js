/**
 * Middleware to restrict access to admin users only.
 * Must be used after the auth middleware.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. Admin privileges required.',
  });
};

/**
 * Middleware to restrict access to vendor or admin users.
 * Must be used after the auth middleware.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const isVendor = (req, res, next) => {
  if (req.user && (req.user.role === 'vendor' || req.user.role === 'admin')) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. Vendor or admin privileges required.',
  });
};

module.exports = { isAdmin, isVendor };
