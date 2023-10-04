import { Order } from "../db/models/order";

class OrderService {
  // 사용자
  static async newOrder(data) {
    const order = await Order.create(data);
    return order;
  }

  static async getOrder(data) {
    const { id, role } = data;

    if (role === "USER") {
      const order = await Order.findById(id);
      if (!order) {
        const errorMessage = "주문 내역이 없습니다.";
        return errorMessage;
      }
      return order;
    } else if (role === "ADMIN") {
      const order = await Order.findAll();
      //페이지네이션이나 사용자별 구매목록은 router에서
      if (!order) {
        const errorMessage = "주문 내역이 없습니다.";
        return errorMessage;
      }
      return order;
    }
  }

  static async updateOrder(data) {
    const { order_id, updateData, role } = data;
    const order = await Order.findById(order_id);

    if (!order) {
      const errorMessage = "주문 내역이 없습니다.";
      return errorMessage;
    }

    if (role === "USER") {
      if (
        order.order_status === "SHIPPED" ||
        order.order_status === "DELIVERED"
      ) {
        const errorMessage = "배송이 시작되어 수정이 불가능합니다.";
        return errorMessage;
      } else if (
        order.order_status === "ORDER_CONFIRMED" ||
        order.order_status === "PREPARING_FOR_SHIPMENT"
      ) {
        const orderUpdate = await Order.update(order_id, updateData);
        return orderUpdate;
      }
    } else if (role === "ADMIN") {
      const orderStatus = await Order.update(order_id, updateData);
      return orderStatus;
    }
    // user 수정가능 주소/전화번호/이름/요청사항
    // admin 수정가능 주문상태
  }

  static async CancelOrder(data) {
    const { order_id, role } = data;

    if (role === "USER" || role == "ADMIN") {
      const order = await Order.findById(order_id);

      if (!order) {
        const errorMessage = "주문 내역이 없습니다.";
        return errorMessage;
      }

      await Order.delete({ order_id });
      const cancelMessage = "주문이 취소되었습니다.";
      return cancelMessage;
    } else {
      const errorMessage = "주문 취소 권한이 없습니다.";
      return errorMessage;
    }
  }
}

export default OrderService;
