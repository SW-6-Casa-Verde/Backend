import path from "path";
import express from "express";

const viewsRouter = express.Router();

viewsRouter.use(express.static(path.join(__dirname, "../views"), { index: "img-upload-test.html" }));

export { viewsRouter };
