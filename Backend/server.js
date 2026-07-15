const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const movieRoute = require("./routes/movieRoute");
const theatreRoute = require("./routes/theatreRoute");
const showRoute = require("./routes/showRoute");
const bookingRoute = require("./routes/bookingRoute");
const { validateJWTToken } = require("./middleware/authorizationMiddleware");
const errorHandler = require("./middleware/errorHandler");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

connectDB();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
// mounted before the rate limiter so the docs UI's asset requests don't
// consume the API budget; docs are public (auth is applied per route group)
app.use("/bms/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/bms", apiLimiter);
app.use("/bms/users", userRoute);
app.use("/bms/movies", validateJWTToken, movieRoute);
app.use("/bms/theatres", validateJWTToken, theatreRoute);
app.use("/bms/shows", validateJWTToken, showRoute);
app.use("/bms/bookings", validateJWTToken, bookingRoute);

// must stay the last app.use — converts thrown ApiErrors into {success:false} responses
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
