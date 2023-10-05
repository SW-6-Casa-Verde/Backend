import { create } from "domain";
import { Item } from "../db/models/Item"; // db/index.js 완성되면 바꾸기 -> ../db
import { Category } from "../db/models/Category"; // db/index.js 완성되면 바꾸기 -> ../db

class itemService {
  // Create
  static async addItem({ name, price, description, main_image, images, category }) {
    let newItem = { name, price, description, main_image, category };
    if (images) {
      newItem.images = images;
    }

    const createdNewItem = await Item.create({ newItem });

    return createdNewItem;
  }

  // Read
  // 상품 1개
  static async getItem(item_id) {
    const item = await Item.findById(item_id);

    if (!item) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    return item;
  }

  // 상품 전체 & pagination
  static async getItems(page, perPage) {
    const [items, totalPage] = await Item.findByCategory({}, page, perPage);

    if (!items) {
      const errorMessage = "상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    return [items, totalPage];
  }

  // 카테고리별 상품 & pagination
  static async getItemsByCategory(category_id, page, perPage) {
    const category = Category.findById(category_id);

    if (!category) {
      const errorMessage = "카테고리가 존재하지 않습니다.";
      return { errorMessage };
    }

    const [items, totalPage] = await Item.findByCategory({ category }, page, perPage);

    if (!items) {
      const errorMessage = "상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    return [items, totalPage];
  }

  // Update
  static async setItem(item_id, query) {
    const item = await Item.findById(item_id);

    if (!item) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    const updatedItem = await Item.updateById(item_id, query);
    return updatedItem;
  }

  // Delete
  static async removeItem(item_id) {
    const item = await Item.findById(item_id);

    if (!item) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    const deletedItem = await Item.deleteById(item_id);
    return deletedItem;
  }
}

export { itemService };
