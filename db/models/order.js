import { model } from "mongoose";
import { OrderSchema } from "../schemas/order";
import UserSchema from "../schemas/user";

const OrderModel = model("Order", OrderSchema);
const UserModel = model("User", UserSchema);

class Order {
  static async findAll() {
    return await OrderModel.find({});
  }

  static async create(newOrder) {
    return await OrderModel.create(newOrder);
  }

  static async findByOrderId(order_id) {
    return await OrderModel.findOne({ _id: order_id });
  }

  static async findByUserId(userId) {
    return await OrderModel.findOne({ user_id: userId });
  }

  static async getPaginatedOrders(data, page, perPage) {
    const [total, orders] = await Promise.all([
      OrderModel.countDocuments(data),
      OrderModel.find(data)
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate("user_id"),
    ]);

    const totalPage = Math.ceil(total / perPage);

    return { orders, totalPage };
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
