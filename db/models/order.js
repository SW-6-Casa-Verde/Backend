import { model } from "mongoose";
import OrderSchema from "../schemas/order";

const OrderModel = model("Order", OrderSchema);

class Order {
  static async findAll() {
    return await OrderModel.find({});
  }

  static async create(newOrder) {
    return await OrderModel.create(newOrder);
  }

  static async findByOrderId({ order_id }) {
    return await OrderModel.findOne({ order_id });
  }

  static async findByUserId(userId) {
    return await OrderModel.findOne({ user_id: userId });
  }

  static async getPaginatedOrders(query, page, perPage) {
    const [total, orders] = await Promise.all([
      OrderModel.countDocuments(query),
      OrderModel.find(query)
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate("user_id"), // populate 추가하기
    ]);

    const totalPage = Math.ceil(total / perPage);

    return [orders, totalPage];
  }

  //Update를 실행한 뒤의 업데이트된 데이터를 콘솔로 확인하고 싶다면 new 옵션
  static async update(order_id, updatedData) {
    return await OrderModel.findByIdAndUpdate(order_id, updatedData, {
      new: true,
    });
  }

  static async delete(order_id) {
    return await OrderModel.findByIdAndDelete(order_id);
  }
}

export { Order };
