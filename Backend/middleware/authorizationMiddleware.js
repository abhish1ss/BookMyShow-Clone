const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const validateJWTToken = (req, res, next) => {
  try {
    // primary: httpOnly cookie; fallback: Bearer header (Swagger, curl)
    const token =
      req?.cookies?.tokenForBMS || req?.headers?.authorization?.split(" ")[1];
    // jwt.verify throws TokenExpiredError on expiry — no manual exp check needed
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.body.userId = decoded?.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Expired Token"));
    }
    next(new ApiError(401, "Invalid/Expired Token"));
  }
};

module.exports = {
  validateJWTToken,
};
