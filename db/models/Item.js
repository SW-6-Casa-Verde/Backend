import { model } from "mongoose";
import { ItemSchema } from "../schemas/item";
import { CategorySchema } from "../schemas/category";

const ItemModel = model("Item", ItemSchema);

class Item {
  // CREATE
  static async create({ newItem }) {
    const createdNewItem = await ItemModel.insertOne({ newItem });
    return createdNewItem;
  }

  // READ
  // 카테고리별 상품
  static async findByCategory(query, page, perPage, sortQuery) {
    // 정렬 X
    if (!sortQuery) {
      const [total, items] = await Promise.all([
        ItemModel.countDocuments({}),
        ItemModel.find(query)
          .skip(perPage * (page - 1))
          .limit(perPage)
          .populate("category"),
      ]);

      const totalPage = Math.ceil(total / perPage);

      return [items, totalPage];
    }

    // 정렬 O
    const [total, items] = await Promise.all([
      ItemModel.countDocuments({}),
      ItemModel.find(query)
        .sort(sortQuery)
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate("category"),
    ]);

    const totalPage = Math.ceil(total / perPage);

    return [items, totalPage];
  }

  // 상품 한 개
  static async findById(id) {
    const item = await ItemModel.findOne({ id }).populate("category");
    return item;
  }

  // UPDATE
  static async updateById(id, query) {
    const item = await ItemModel.findOneAndUpdate({ id }, query).populate("category");
    return item;
  }

  // DELETE
  static async deleteById(id) {
    const item = await ItemModel.delete({ id }).populate("category");
    return item;
  }
}

export { Item };
