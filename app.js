//external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 4000;
// internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");

const app = express();
dotenv.config();

// database connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

// request parsers
/*

In an Express.js application, the app.use(express.json()) middleware is used to parse incoming requests with JSON payloads. When a client sends data to the server, it's often sent in the body of the HTTP request, especially in the case of POST, PUT, and PATCH requests. This data is typically in JSON format.
The express.json() middleware parses the incoming JSON payload and makes it available in the request.body object. This allows you to easily work with the data sent by the client in your route handlers.
*/
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup

//error handling

//404 not found error
app.use(notFoundHandler);

//common error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening to port ${port}`);
});
