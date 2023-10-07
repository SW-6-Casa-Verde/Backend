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

  static async deleteById({ order_id }) {
    return await OrderItemModel.findByIdAndDelete({ order_id });
  }
  //order delete 하면 db orderItem도 삭제되나
}

export { OrderItem };
