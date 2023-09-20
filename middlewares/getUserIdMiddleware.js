const jwt = require("jsonwebtoken");

// middleware function to extract id from the token
function getUserIdMiddleware(secretKey) {
  return (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        message: "Authentication Failed, token not found",
      });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Authentication failed, no valid token found",
        });
      }

      req.user_id = decoded.userId;
      next();
    });
  };
}

module.exports = getUserIdMiddleware;
