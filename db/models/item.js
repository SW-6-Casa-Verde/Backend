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
  static async findByCategory({ category, page, perPage, sortFilter }) {
    const filter = category ? { category } : {};
    const [total, items] = await Promise.all([
      ItemModel.find(filter).countDocuments({}),
      ItemModel.find(filter)
        .sort(sortFilter)
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate("category"),
    ]);

    const totalPage = Math.ceil(total / perPage);

    return { items, totalPage };
  }

  // 상품 한 개
  static async findByFilter(filter) {
    return await ItemModel.findOne(filter).populate("category");
  }

  // UPDATE
  static async updateByFilter(filter, data) {
    return await ItemModel.findOneAndUpdate(filter, data, { new: true }).populate("category");
  }

  // DELETE
  static async deleteByFilter(filter) {
    return await ItemModel.findOneAndDelete(filter, { new: true }).populate("category");
  }
}

export { Item };
