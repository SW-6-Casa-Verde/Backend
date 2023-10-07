import { model } from "mongoose";
import { CategorySchema } from "../schemas/category";

const CategoryModel = model("Category", CategorySchema);

class Category {
  // Create
  static async create({ id, name }) {
    return await CategoryModel.create({ id, name });
  }

  // Read
  static async findAll() {
    return await CategoryModel.find({});
  }

  static async findById({ id }) {
    return await CategoryModel.findOne({ id });
  }

  static async findByName({ name }) {
    return await CategoryModel.findOne({ name });
  }

  // Update
  static async updateById({ id }, query) {
    return await CategoryModel.findOneAndUpdate({ id }, query, { new: true });
  }

  static async updateByName({ name }, query) {
    return await CategoryModel.findOneAndUpdate({ name }, query, { new: true });
  }

  // Delete
  static async deleteById({ id }, query) {
    return await CategoryModel.findOneAndDelete({ id }, query, { new: true });
  }

  static async deleteByIdByName({ name }, query) {
    await CategoryModel.findOneAndDelete({ name }, query, { new: true });
  }
}

export { Category };
