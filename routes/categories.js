import { Router } from "express";
import { CategoryService } from "../services/categoryService";

const categoryRouter = Router();

categoryRouter.get("/categories", async (req, res) => {
  try {
    const categories = await CategoryService.getCategories();

    if (categories.errorMessage) {
      throw new Error(categories.errorMessage);
    }

    res.status(200).json({ message: "success", categories });
  } catch (error) {
    next(error);
  }
});

categoryRouter.post("/categories", async (req, res) => {
  // 관리자 인증 미들웨어 추가
});

export { categoryRouter };
