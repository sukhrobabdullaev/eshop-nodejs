const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(403).send("Access Denied: No Token Provided!");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add decoded user data to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).send("Invalid Token!");
  }
};

module.exports = verifyToken;
