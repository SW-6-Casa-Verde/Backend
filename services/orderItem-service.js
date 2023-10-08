import { OrderItem } from "../db";

class OrderItemService {
  static async addOrderItem(data) {
    console.log("여기냐ㅐ!!");
    const order = await OrderItem.create(data);

    if (!order) {
      return { errorMessage: "주문 상품을 생성하는 동안 오류가 발생했습니다." };
    }

    return order;
  }

  static async deleteOrderItem(orderId) {
    const order = await OrderItem.deleteManyByOrderId(orderId);

    if (!order) {
      return { errorMessage: "주문 상품을 삭제하는 동안 오류가 발생했습니다." };
    }

    return order;
  }
}

export { OrderItemService };
