const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const cookieParser = require("cookie-parser")
const errorHandler = require("./middleware/error");
const fileupload = require("express-fileupload");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const hpp = require('hpp');

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect To DB
connectDB();

//Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const app = express();


//Body Parser
app.use(express.json())

//File Uploading
app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//Set Securtiy headers
app.use(helmet())

//Prevent Xss attacks(Cross side scripting Text) 
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

app.use(cookieParser())

//Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

//Custom Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle unhandled promise rejections
process.on("uncaughtException", (err, promise) => {
  console.log(`Error : ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});
