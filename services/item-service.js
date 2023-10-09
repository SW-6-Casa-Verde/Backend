import { Item } from "../db";
import fs from "fs";

class ItemService {
  // Create
  static async addItem({ name, price, description, main_images, images, category }) {
    return await Item.create({ name, price, description, main_images, images, category });
  }

  // Read
  // 상품 한 개
  static async getItem(filter) {
    const item = await Item.findByFilter(filter);

    if (!item) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    return item;
  }

  // 상품 전체 & sort
  static async getItems({ page, perPage, sortFilter }) {
    return await Item.findByCategory({ page, perPage, sortFilter });
  }

  // 카테고리별 상품 & sort
  static async getItemsByCategory({ category, page, perPage, sortFilter }) {
    return await Item.findByCategory({ category, page, perPage, sortFilter });
  }

  // Update
  static async setItem({ id }, data) {
    const item = await Item.findByFilter({ id });
    console.log("setItem in");

    if (!item) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    if (data.main_images && data.images) {
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

    return await Item.updateByFilter({ id }, data);
  }

  // Delete
  static async deleteItem({ id, category }) {
    const item = await Item.findByFilter({ id, category });

    if (!item) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

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

    return await Item.deleteByFilter({ id, category });
  }
}

export { ItemService };
