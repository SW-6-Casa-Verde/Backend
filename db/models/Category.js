import { model } from "mongoose";
import { CategorySchema } from "../schemas/category";

const CategoryModel = model("Category", CategorySchema);

class Category {
    // Create
    static async create({ newCategory }) {
        const category = CategoryModel.insertOne({ newCategory });
        return category;
    }

    // Read
    static async findAll() {
        const categories = CategoryModel.find({});
        return categories;
    }
    
    static async findById( id ) {
        const category = CategoryModel.findOne({ id });
        return category;
    }

    static async findByName( name ) {
        const category = CategoryModel.findOne({ name });
        return category;
    }

    // Update
    static async updateById({ id }, { query }) {
        const category = CategoryModel.findOneAndUpdate({ id }, { query });
        return category;
    }

    static async updateByName({ name }, { query }) {
        const category = CategoryModel.findOneAndUpdate({ name }, { query });
        return category;
    }

    // Delete
    static async deleteById({ id }, { query }) {
        const category = CategoryModel.findOneAndDelete({ id }, { query });
        return category;
    }

    static async deleteByIdByName({ name }, { query }) {
        const category = CategoryModel.findOneAndDelete({ name }, { query });
        return category;
    }
}

export { Category }