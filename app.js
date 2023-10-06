import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dbBoot from "./db";

import indexRouter from "./routes";
import usersRouter from "./routes/users";
import orderRouter from "./routes/order";
import { categoryRouter } from "./routes/categories";

const app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 라우터 등록
app.get("/", (req, res) => {
  res.render("img-upload-test", { title: "test" });
});
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/order", orderRouter);
app.use("/categories", categoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // response error
  const { status, message } = err;
  res.status(status || 500);
  res.json({ status, message });
});

module.exports = app;
