import jwt from "jsonwebtoken";

/**
 * Generate a JWT token and set it as an HTTP-only cookie on the response.
 * @param {string} userId - MongoDB _id of the user
 * @param {object} res    - Express response object
 * @returns {string}      - The signed token
 */
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("mingo_token", token, {
    httpOnly: true,         // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};

/**
 * Verify a JWT token.
 * @param {string} token - JWT string
 * @returns {object}     - Decoded payload { userId }
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
