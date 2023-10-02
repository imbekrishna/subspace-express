require("dotenv").config()
const express = require("express");
const logger = require("morgan");

const apiRouter = require("./routes/api");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({message: "Not Found", status:404})
  next();
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
