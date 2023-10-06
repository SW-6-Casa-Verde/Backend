import { OrderItem } from "../db/models/orderItem";

class OrderItemService {
  static async addOrderItem(data) {
    const order = await OrderItem.create(data);

    if (!order) {
      throw {
        status: 500,
        message: "주문을 생성하는 동안 오류가 발생했습니다.",
      };
    }

    return order;
  }
}

export default OrderItemService;
