import path from "path";
import express from "express";

const viewsRouter = express.Router();

viewsRouter.use("/", serveStatic("main"));
viewsRouter.use("/cart", serveStatic("cart"));
viewsRouter.use("/mypage", serveStatic("mypage"));
viewsRouter.use("/manager", serveStatic("manager"));
viewsRouter.use("/manager/category", serveStatic("category-management", "manager"));
viewsRouter.use("/manager/item", serveStatic("item-management", "manager"));
viewsRouter.use("/manager/order", serveStatic("order-management", "manager"));
viewsRouter.use("/manager", serveStatic("manager"));
viewsRouter.use("/manager", serveStatic("manager"));

viewsRouter.use("/detail", serveStatic("detailpage"));
viewsRouter.use("/common", serveStatic("common"));
viewsRouter.use("/order", serveStatic("order"));
viewsRouter.use("/login", serveStatic("login"));
viewsRouter.use("/sing-up", serveStatic("sing-up"));
viewsRouter.use("/categories", serveStatic("categories"));
viewsRouter.use("/order-completed", serveStatic("order-completed"));

// views 폴더의 최상단 파일인 rabbit.png, api.js 등을 쓸 수 있게 함
viewsRouter.use("/", serveStatic(""));

function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  return express.static(resourcePath, option);
}

export { viewsRouter };
