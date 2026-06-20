const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token.
 * @param {Object} payload - Data to encode in the token (e.g., { id, email, role }).
 * @returns {string} Signed JWT token valid for 7 days.
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Verify and decode a JWT token.
 * @param {string} token - The JWT token string.
 * @returns {Object} Decoded token payload.
 * @throws {jwt.JsonWebTokenError} If the token is invalid or expired.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
