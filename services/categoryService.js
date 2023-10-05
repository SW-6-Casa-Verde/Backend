import { model } from "mongoose";
import { Category } from "../db/models/Category";

class CategoryService {
  // Create
  static async addCategory({ id, name }) {
    const category = Category.findById({ id });

    if (category) {
      const errorMessage = "해당 아이디가 이미 존재합니다.";
      return { errorMessage };
    }

    const newCategory = { id, name };
    const createdNewCategory = await Category.create({ newCategory });

    return createdNewCategory;
  }

  // Read
  // 전체 카테고리
  static async getCategories() {
    const categories = Category.findAll();

    if (!categories) {
      const errorMessage = "카테고리가 없습니다. 카테고리를 생성해 주세요.";
      return { errorMessage };
    }

    return categories;
  }

  // 카테고리 한 개
  static async getCategory({ id }) {
    const category = Category.findById({ id });

    if (!category) {
      const errorMessage = "해당 카테고리가 없습니다.";
      return { errorMessage };
    }

    return category;
  }

  // Update
  static async setCategory({ id }, { query }) {
    const category = Category.findById({ id }); // 존재하는지 먼저 찾는 작업

    if (!category) {
      const errorMessage = "해당 카테고리가 없습니다.";
      return { errorMessage };
    }

    const updatedCategory = Category.updateById({ id }, { query });

    return updatedCategory;
  }

  // Delete
  static async deleteCategory({ id }) {
    const category = Category.findById({ id }); // 존재하는지 먼저 찾는 작업

    if (!category) {
      const errorMessage = "해당 카테고리가 없습니다.";
      return { errorMessage };
    }

    const removedCategory = Category.deleteById({ id });

    return removedCategory;
  }
}

export { CategoryService };
