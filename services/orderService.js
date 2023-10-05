import { Order, OrderModel } from "../db/models/order";

class OrderService {
  // 사용자
  static async addOrder(data) {
    if (
      !data.total_price ||
      !data.name ||
      !data.address ||
      !data.phone ||
      !data.user_id
    ) {
      throw { status: 422, message: "주문 정보가 올바르지 않습니다." };
    }

    const order = await Order.create(data);

    if (!order) {
      throw {
        status: 500,
        message: "주문을 생성하는 동안 오류가 발생했습니다.",
      };
    }

    return order;
  }

  static async getOrder(data, page) {
    //data : user or admin
    const perPage = 10;

    if (data === "admin") {
      const total = await OrderModel.countDocuments({});
      const orders = await Order.findAll()
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);

      const totalPage = Math.ceil(total / perPage);
      //사용자별 구매목록은 router에서
      if (!orders.length) {
        throw new Error("주문 내역이 없습니다.");
      }

      return { totalPage, orders };
    } else {
      const orders = await Order.findByUserId(data);

      if (!orders.length) {
        throw new Error("사용자의 주문 내역이 없습니다.");
      }
      return orders;
    }
  }

  static async setOrder(data) {
    const { order_id, updateData, role } = data;
    const order = await Order.findByOrderId(order_id);

    if (!order) {
      const errorMessage = "주문 내역이 없습니다.";
      return errorMessage;
    }

    if (role === "user") {
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
    } else if (role === "admin") {
      const orderStatus = await Order.update(order_id, updateData);
      return orderStatus;
    }
    // user 수정가능 주소/전화번호/이름/요청사항
    // admin 수정가능 주문상태
  }

  static async deleteOrder(data) {
    const { order_id, role, currentId } = data;
    const order = await Order.findByOrderId(order_id);

    if (!order) {
      const errorMessage = "주문 내역이 없습니다.";
      return errorMessage;
    }

    if (role === "user") {
      if (order.user_id !== currentId) {
        const errorMessage = "주문 취소 권한이 없습니다.";
        return errorMessage;
      }

      await Order.delete({ order_id });
      const cancelMessage = "주문이 취소되었습니다.";
      return cancelMessage;
    } else if (role === "admin") {
      await Order.delete({ order_id });
      const cancelMessage = "주문이 취소되었습니다.";
      return cancelMessage;
    }
    const errorMessage = "비회원은 접근할 수 없습니다.";
    return errorMessage;
  }
}

export default OrderService;
