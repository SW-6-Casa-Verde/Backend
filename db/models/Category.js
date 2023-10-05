import { model } from "mongoose";
import { CategorySchema } from "../schemas/category";

const CategoryModel = model("Category", CategorySchema);

class Category {
  // Create
  static async create({ newCategory }) {
    const category = await CategoryModel.create(newCategory);
    return category;
  }

  // Read
  static async findAll() {
    const categories = await CategoryModel.find({});
    return categories;
  }

  static async findById({ id }) {
    const category = await CategoryModel.findOne({ id });
    return category;
  }

  static async findByName({ name }) {
    const category = await CategoryModel.findOne({ name });
    return category;
  }

  // Update
  static async updateById({ id }, query) {
    const category = await CategoryModel.findOneAndUpdate({ id }, query, { new: true });
    return category;
  }

  static async updateByName({ name }, query) {
    const category = await CategoryModel.findOneAndUpdate({ name }, query, { new: true });
    return category;
  }

  // Delete
  static async deleteById({ id }, query) {
    const category = await CategoryModel.findOneAndDelete({ id }, query, { new: true });
    return category;
  }

  static async deleteByIdByName({ name }, query) {
    const category = await CategoryModel.findOneAndDelete({ name }, query, { new: true });
    return category;
  }
}

export { Category };
