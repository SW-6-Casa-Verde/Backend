import { Router } from "express";
import { ItemService } from "../services/item-service";
import asyncHandler from "../utils/asyncHandler";

const itemRouter = Router();

itemRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1, perPage = 10, sort } = req.query;
    const category = req.category;
    let sortQuery = { createdAt: -1 };

    if (sort === "인기순") {
      sortQuery = { sales: -1 };
    }

    // 전체 상품 조회
    if (!category) {
      const { items, totalPage, errorMessage } = await ItemService.getItems({ page, perPage, sortQuery });

      if (errorMessage) {
        throw { status: 404, message: errorMessage };
      }

      res.status(200).json({ message: "success", items, totalPage });
    }

    // 카테고리별 상품 조회
    if (category) {
      const { items, totalPage, errorMessage } = await ItemService.getItemsByCategory({ category, page, perPage, sortQuery });

      if (errorMessage) {
        throw { status: 404, message: errorMessage };
      }

      res.status(200).json({ message: "success", items, totalPage });
    }
  })
);

itemRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = req.category;

    let query = { id };
    if (category) {
      query.category = category;
    }

    const item = await ItemService.getItem(query);

    if (item.errorMessage) {
      throw { status: 404, message: item.errorMessage };
    }

    res.status(200).json({ message: "success", item });
  })
);

itemRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, price, description, main_image, images = null } = req.body;
    const category = req.category;

    if (!name || !price || !description || !main_image || !category) {
      throw { status: 400, message: "잘못된 요청입니다. 요청한 값을 다시 확인해주세요." };
    }

    const item = await ItemService.addItem({ name, price, description, main_image, images, category });

    res.status(201).json({ message: "success", item });
  })
);

itemRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, price, description, main_image, images = null } = req.body;
    const category = req.category;

    if (!name || !price || !description || !main_image || !category) {
      throw { status: 400, message: "잘못된 요청입니다. 요청한 값을 다시 확인해주세요." };
    }

    const item = await ItemService.setItem({ id }, { name, price, description, main_image, images, category });

    if (item.errorMessage) {
      throw { status: 404, message: item.errorMessage };
    }

    res.status(201).json({ message: "success", item });
  })
);

itemRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = req.category;

    const item = await ItemService.deleteItem({ id, category });

    if (item.errorMessage) {
      throw { status: 404, message: item.errorMessage };
    }

    res.status(200).json({ message: "success", item });
  })
);

export { itemRouter };
