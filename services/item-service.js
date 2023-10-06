import { Item } from "../db/models/Item"; // db/index.js 완성되면 바꾸기 -> ../db

class ItemService {
  // Create
  static async addItem({ name, price, description, main_image, images, category }) {
    return await Item.create({ name, price, description, main_image, images, category });
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

    if (!item) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
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
