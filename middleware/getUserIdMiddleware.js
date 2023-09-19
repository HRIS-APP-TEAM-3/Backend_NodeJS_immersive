const jwt = require("jsonwebtoken");

// middleware function to extract id from the token
function attachUserIdToRequest() {
  return (req, res, next) => {
    try {
      console.log("middleware jalan");
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, "mySecretKeyIsMyDogsName");
      req.user_id = decoded.id; // Assuming "id" is the key in the token for user ID
      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: "Authentication failed and no user found" });
    }
  };
}

module.exports = attachUserIdToRequest;
