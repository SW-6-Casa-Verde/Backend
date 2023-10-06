import { Router } from "express";
import { CategoryService } from "../services/category-service";
import { itemRouter } from "./items";
import asyncHandler from "../utils/asyncHandler";

const categoryRouter = Router();

categoryRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const categories = await CategoryService.getCategories();

    if (categories.errorMessage) {
      throw { status: 404, message: categories.errorMessage };
    }

    res.status(200).json({ message: "success", categories }); // status 통일하기
  })
);

categoryRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    // 관리자 인증 미들웨어 추가
    const { name } = req.body;
    const id = Number(req.body.id);

    if (!id || !name) {
      throw {
        status: 400,
        message: "잘못된 요청입니다. 요청한 값을 다시 확인해 주세요",
      }; // 요청 메시지도 최대한 통일하면 좋을 듯
    }

    const category = await CategoryService.addCategory({ id, name });

    if (category.errorMessage) {
      throw { status: 409, message: category.errorMessage };
    }

    res.status(201).json({ message: "success", category });
  })
);

categoryRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    if (!req.body.id || !req.body.name) {
      throw {
        status: 400,
        message: "잘못된 요청입니다. 요청한 값을 다시 확인해 주세요",
      };
    }

    const category = await CategoryService.setCategory({ id }, req.body);

    if (category.errorMessage) {
      throw { status: 409, message: category.errorMessage };
    }

    res.status(200).json({ message: "success", category });
  })
);

categoryRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    const category = await CategoryService.deleteCategory({ id });

    if (category.errorMessage) {
      throw { status: 409, message: category.errorMessage };
    }

    res.status(200).json({ message: "success", category });
  })
);

// 상품 라우터 연결
categoryRouter.use(
  "/:id/items",
  async (req, res, next) => {
    const { id } = req.params;
    console.log("category router in ");

    const category = await CategoryService.getCategory({ id });

    if (category.errorMessage) {
      next({ status: 404, message: category.errorMessage });
    }

    req.category = category;
    next();
  },
  itemRouter
);

export { categoryRouter };
