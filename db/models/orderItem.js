import { model } from "mongoose";
import { OrderItemSchema } from "../schemas/orderItem";
import { ItemSchema } from "../schemas/item";

const OrderItemModel = model("OrderItem", OrderItemSchema);
const ItemModel = model("Item", ItemSchema);

class OrderItem {
  static async findAll() {
    return await OrderItemModel.find({});
  }

  static async create(newOrderItem) {
    const addOrderItem = await OrderItemModel.create(newOrderItem);
    const addQuantity = addOrderItem.quantity;
    const orderItem_id = addOrderItem.item_id;

    await ItemModel.findByIdAndUpdate(orderItem_id, { $inc: { sales: addQuantity } });

    return addOrderItem;
  }

  static async findById({ orderId }) {
    return await OrderItemModel.find({ order_id: orderId });
  }

  static async deleteManyByOrderId(orderId) {
    const orderItems = await OrderItemModel.find({
      order_id: orderId,
    });

    for (const orderItem of orderItems) {
      const itemId = orderItem.item_id;
      const cancelQuantity = orderItem.quantity;

      await ItemModel.findByIdAndUpdate(itemId, { $inc: { sales: -cancelQuantity } });
    }

    return await OrderItemModel.deleteMany({ order_id: orderId });
  }
}

export { OrderItem };
