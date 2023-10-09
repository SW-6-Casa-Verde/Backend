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
  static async updateById({ id }, data) {
    return await CategoryModel.findOneAndUpdate({ id }, data, { new: true });
  }

  static async updateByName({ name }, data) {
    return await CategoryModel.findOneAndUpdate({ name }, data, { new: true });
  }

  // Delete
  static async deleteById({ id }, data) {
    return await CategoryModel.findOneAndDelete({ id }, data, { new: true });
  }

  static async deleteByName({ name }, data) {
    await CategoryModel.findOneAndDelete({ name }, data, { new: true });
  }
}

export { Category };
