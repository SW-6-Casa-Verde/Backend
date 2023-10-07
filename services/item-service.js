import { Item } from "../db";
import fs from "fs";

class ItemService {
  // Create
  static async addItem({ name, price, description, main_images, images, category }) {
    return await Item.create({ name, price, description, main_images, images, category });
  }

  // Read
  // 상품 한 개
  static async getItem(query) {
    const item = await Item.findByQuery(query);

    if (!item) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    return item;
  }

  // 상품 전체 & sort
  static async getItems({ page, perPage, sortQuery }) {
    return await Item.findByCategory({ page, perPage, sortQuery });
  }

  // 카테고리별 상품 & sort
  static async getItemsByCategory({ category, page, perPage, sortQuery }) {
    return await Item.findByCategory({ category, page, perPage, sortQuery });
  }

  // Update
  static async setItem({ id }, query) {
    const item = await Item.findByQuery({ id });
    console.log("setItem in");

    if (!item) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    if (query.main_images && query.images) {
      item.main_images.forEach((imgUrl) =>
        fs.unlink(imgUrl.replace(process.env.SERVER_URI + "/", ""), (err) => {
          if (err) console.log("기존 사진 파일 삭제 실패 : ", err);
        })
      );
      item.images.forEach((imgUrl) =>
        fs.unlink(imgUrl.replace(process.env.SERVER_URI + "/", ""), (err) => {
          if (err) console.log("기존 사진 파일 삭제 실패 : ", err);
        })
      );
    }

    return await Item.updateByQuery({ id }, query);
  }

  // Delete
  static async deleteItem({ id, category }) {
    const item = await Item.findByQuery({ id, category });

    if (!item) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    return await Item.deleteByQuery({ id, category });
  }
}

export { ItemService };
