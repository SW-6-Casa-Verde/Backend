import { Category } from "../db";

class CategoryService {
  // Create
  static async addCategory({ id, name }) {
    const category = await Category.findById({ id });
    console.log(id, name);

    if (category) {
      const errorMessage = "해당 아이디가 이미 존재합니다.";
      return { errorMessage };
    }

    return await Category.create({ id, name });
  }

  // Read
  // 전체 카테고리
  static async getCategories() {
    return await Category.findAll();
  }

  // 카테고리 한 개
  static async getCategory({ id }) {
    const category = await Category.findById({ id });

    if (!category) {
      const errorMessage = "해당 카테고리가 없습니다.";
      return { errorMessage };
    }

    return category;
  }

  // Update
  static async setCategory({ id }, query) {
    const category = await Category.findById({ id }); // 존재하는지 먼저 찾는 작업

    if (!category) {
      const errorMessage = "해당 카테고리가 없습니다.";
      return { errorMessage };
    }

    const updateIdCheck = await Category.findById({ id: query.id });

    if (updateIdCheck && id !== query.id) {
      const errorMessage = "해당 아이디가 이미 존재합니다.";
      return { errorMessage };
    }

    return await Category.updateById({ id }, query);
  }

  // Delete
  static async deleteCategory({ id }) {
    const category = await Category.findById({ id }); // 존재하는지 먼저 찾는 작업

    if (!category) {
      const errorMessage = "해당 카테고리가 없습니다.";
      return { errorMessage };
    }

    return await Category.deleteById({ id });
  }
}

export { CategoryService };
