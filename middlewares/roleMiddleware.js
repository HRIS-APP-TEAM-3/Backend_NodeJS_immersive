const jwt = require("jsonwebtoken");

function roleMiddleware(requiredRole) {
  const secretKey = `verysectretkey007`;
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

      if (!requiredRole.includes(decoded.roleId)) {
        return res.status(401).json({
          message:
            "Authentication Failed, role tidak valid, anda tidak diizinkan untuk mengakses ini",
        });
      }

      req.user = decoded;
      next();
    });
  };
}

module.exports = roleMiddleware;
