import { model } from "mongoose";
import { OrderItemSchema } from "../schemas/orderItem";

const OrderItemModel = model("OrderItem", OrderItemSchema);

class OrderItem {
  static async findAll() {
    return await OrderItemModel.find({});
  }

  static async create({ newOrder }) {
    return await OrderItemModel.create({ newOrder });
  }

  static async findById({ order_id }) {
    return await OrderItemModel.findOne({ order_id });
  }

  static async update(order_id, updatedData) {
    return await OrderItemModel.findByIdAndUpdate(order_id, updatedData, {
      new: true,
    });
  }

  static async deleteById({ order_id }) {
    return await OrderItemModel.findByIdAndDelete({ order_id });
  }

  static async deleteAll() {
    return await OrderItemModel.deleteMany({});
  }
}

export { OrderItem };
