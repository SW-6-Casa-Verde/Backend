import { model } from "mongoose";
import { ItemSchema } from "../schemas/item";

const ItemModel = model("Item", ItemSchema);

class Item {
  // CREATE
  static async create({ name, price, description, main_images, images, category }) {
    return await ItemModel.create({ name, price, description, main_images, images, category });
  }

  // READ
  // 카테고리별 상품
  static async findByCategory({ category, page, perPage, sortQuery }) {
    const query = category ? { category } : {};
    const [total, items] = await Promise.all([
      ItemModel.find(query).countDocuments({}),
      ItemModel.find(query)
        .sort(sortQuery)
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate("category"),
    ]);

    const totalPage = Math.ceil(total / perPage);

    return { items, totalPage };
  }

  // 상품 한 개
  static async findByQuery(query) {
    return await ItemModel.findOne(query).populate("category");
  }

  // UPDATE
  static async updateByQuery(findQuery, updateQuery) {
    return await ItemModel.findOneAndUpdate(findQuery, updateQuery, { new: true }).populate("category");
  }

  // DELETE
  static async deleteByQuery(query) {
    return await ItemModel.findOneAndDelete(query, { new: true }).populate("category");
  }
}

export { Item };
