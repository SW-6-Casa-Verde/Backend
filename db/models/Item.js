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
  static async findByCategory({ category_id }, sortQuery, page, perPage) {
    const category = await CategorySchema.findOne({ id: category_id });
    const itemList = await ItemModel.find({ category_id: category }).populate(
      "category"
    );

    // 정렬
    if (sortQuery) itemList = await itemList.sort(sortQuery);

    // pagination
    if (page && perPage) {
      const [total, items] = await Promise.all([
        ItemModel.countDocuments({}),
        itemList.skip(perPage * (page - 1)).limit(perPage),
      ]);

      const totalPage = Math.ceil(total / perPage);

      return [items, totalPage];
    }

    // pagenation 필요 없을 떄
    return [itemList, null];
  }

  static async findById(id) {
    const item = await ItemModel.findOne({ id }).populate("category");
    return item;
  }

  // UPDATE
  static async updateById(id, query) {
    const item = await ItemModel.findOneAndUpdate({ id }, query).populate(
      "category"
    );
    return item;
  }

  // DELETE
  static async deleteById(id) {
    const item = await ItemModel.delete({ id }).populate("category");
    return item;
  }
}

export { Item };
