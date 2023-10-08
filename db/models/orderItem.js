import { model } from "mongoose";
import { OrderItemSchema } from "../schemas/orderItem";

const OrderItemModel = model("OrderItem", OrderItemSchema);

class OrderItem {
  static async findAll() {
    return await OrderItemModel.find({});
  }

  static async create(newOrderItem) {
    return await OrderItemModel.create(newOrderItem);
  }

  static async findById({ order_id }) {
    return await OrderItemModel.findOne({ order_id });
  }

  static async deleteManyByOrderId(orderId) {
    console.log("여기냐ㅐ!!");
    return await OrderItemModel.deleteMany({ order_id: orderId });
  }
}

export { OrderItem };
