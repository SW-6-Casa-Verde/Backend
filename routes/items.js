import { Router } from "express";
import { ItemService } from "../services";
import asyncHandler from "../utils/asyncHandler";
import { itemImg } from "../middlewares/upload-itemlmg";
import jwtAdminRole from "../middlewares/jwt-admin-role";

const itemRouter = Router();
const SERVER_URI = process.env.SERVER_URI;

// 상품 여러 개 조회
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

// 상품 상세 조회
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

// 상품 추가
itemRouter.post(
  "/",
  jwtAdminRole,
  itemImg.fields([{ name: "main_images", maxCount: 2 }, { name: "images" }]),
  asyncHandler(async (req, res) => {
    console.log("item router in ", req.files);
    const { name, price, description } = req.body;
    const category = req.category;

    if (!name || !price || !description || !category || !req.files.main_images) {
      throw { status: 400, message: "잘못된 요청입니다. 요청한 값을 다시 확인해주세요." };
    }

    const main_images = req.files.main_images.map((img) => `${SERVER_URI}/${img.path.replace(/\\/g, "/")}`);
    const images = req.files.images?.map((img) => `${SERVER_URI}/${img.path.replace(/\\/g, "/")}`) || [];

    const item = await ItemService.addItem({ name, price, description, main_images, images, category });

    res.status(201).json({ message: "success", item });
  })
);

// 상품 수정
itemRouter.put(
  "/:id",
  jwtAdminRole,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const category = req.category;

    if (!name || !price || !description || !category) {
      throw { status: 400, message: "잘못된 요청입니다. 요청한 값을 다시 확인해주세요." };
    }

    const item = await ItemService.setItem({ id }, { name, price, description, category });

    if (item.errorMessage) {
      throw { status: 404, message: item.errorMessage };
    }

    res.status(201).json({ message: "success", item });
  })
);

// 상품 이미지 수정
itemRouter.put(
  "/:id/images",
  jwtAdminRole,
  itemImg.fields([{ name: "main_images", maxCount: 2 }, { name: "images" }]),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log("item router in");
    const main_images = req.files.main_images.map((img) => `${SERVER_URI}/${img.path.replace(/\\/g, "/")}`);
    const images = req.files.images?.map((img) => `${SERVER_URI}/${img.path.replace(/\\/g, "/")}`) || [];

    if (!main_images) {
      throw { status: 400, message: "잘못된 요청입니다. 요청한 값을 다시 확인해주세요." };
    }

    const item = await ItemService.setItem({ id }, { main_images, images });

    res.status(200).json({ message: "success", item });
  })
);

// 상품 삭제
itemRouter.delete(
  "/:id",
  jwtAdminRole,
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
