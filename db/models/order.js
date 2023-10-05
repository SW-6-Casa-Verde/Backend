import { model } from "mongoose";
import OrderSchema from "../schemas/order";

const OrderModel = model("Order", OrderSchema);

class Order {
  static async findAll() {
    const orders = await OrderModel.find({});
    return orders;
  }

  static async create(newOrder) {
    const createdNewOrder = await OrderModel.create(newOrder);
    return createdNewOrder;
  }

  static async findByOrderId({ order_id }) {
    const order = await OrderModel.findOne({ id: order_id });
    return order;
  }

  static async findByUserId({ userId }) {
    const order = await OrderModel.findOne({ user_id: userId });
    return order;
  }

  //Update를 실행한 뒤의 업데이트된 데이터를 콘솔로 확인하고 싶다면 new 옵션
  static async update(order_id, updatedData) {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      order_id,
      updatedData,
      { new: true }
    );
    return updatedOrder;
  }

  static async delete({ order_id }) {
    const deletedOrder = await OrderModel.findByIdAndDelete({ order_id });
    return deletedOrder;
  }
}

export { Order, OrderModel };
