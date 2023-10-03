import { model } from "mongoose";
import { ItemSchema } from "../schemas/item";
import { CategorySchema } from "../schemas/category";

const ItemModel = model("Item", ItemSchema);

class Item {
  static async findById({ item_id }) {
    const item = await ItemModel.findOne({ id: item_id });
    return item;
  }

  static async findAll() {
    const items = await ItemModel.find({});
    return items;
  }

  static async findByCategory({ category_id }) {
    const category = await CategorySchema.findOne({ id: category_id });
    const items = await ItemModel.find({ category_id: category }).populate('');
    return items;
  }
}

export { Item };