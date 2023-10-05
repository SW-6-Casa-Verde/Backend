import { Router } from "express";
import { itemService } from "../services/itemService";
import asyncHandler from "../utils/asyncHandler";

const itemRouter = Router();

itemRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const sort = req.query.sort;
    const category = req.category;

    // sort query 설정
    if (!sort || sort === "최신순") {
      sort = { created_at: -1 };
    } else if (sort === "인기순") {
      sort = { sales: -1 };
    } else {
      throw { status: 400, message: "잘못된 요청입니다. 요청한 값을 다시 확인해주세요." };
    }

    // 전체 상품 조회
    if (!category && !sort) {
      const items = await itemService.getItems(page, perPage, sort);

      if (items.errorMessage) {
        throw { status: 404, message: items.errorMessage };
      }

      res.status(200).json({ message: "success", items });
    }

    // 카테고리별 상품 조회
    if (category && !sort) {
      const items = await itemService.getItemsByCategory({ category }, page, perPage, sort);

      if (items.errorMessage) {
        throw { status: 404, message: items.errorMessage };
      }

      res.status(200).json({ message: "success", items });
    }
  })
);

itemRouter.get(
  "/:item_id",
  asyncHandler(async (req, res) => {
    const { item_id } = req.params;

    const item = await itemService.getItem({ item_id });

    if (item.errorMessage) {
      throw { status: 404, message: item.errorMessage };
    }

    res.status(200).json({ message: "success", item });
  })
);

itemRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, price, description, main_image, images, category } = req.body;

    if (!name || !price || !description || !main_image || !category) {
      throw { status: 400, message: "잘못된 요청입니다. 요청한 값을 다시 확인해주세요." };
    }

    const item = await itemService.addItem({ name, price, description, main_image, images, category });

    res.status(201).json({ message: "success", item });
  })
);

itemRouter.put(
  "/:item_id",
  asyncHandler(async (req, res) => {
    const { item_id } = req.params;
    const { name, price, description, main_image, images, category } = req.body;

    if (!name || !price || !description || !main_image || !category) {
      throw { status: 400, message: "잘못된 요청입니다. 요청한 값을 다시 확인해주세요." };
    }

    const item = await itemService.setItem({ item_id }, { name, price, description, main_image, images, category });

    if (item.errorMessage) {
      throw { status: 404, message: item.errorMessage };
    }

    res.status(201).json({ message: "success", item });
  })
);

itemRouter.delete(
  "/:item_id",
  asyncHandler(async (req, res) => {
    const { item_id } = req.params;

    const item = await itemService.deleteItem({ item_id });

    if (item.errorMessage) {
      throw { status: 404, message: item.errorMessage };
    }

    res.status(200).json({ message: "success", item });
  })
);

export { itemRouter };
