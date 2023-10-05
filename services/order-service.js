import { Order, OrderModel } from "../db/models/order";

class OrderService {
  // 사용자
  static async addOrder(data) {
    const order = await Order.create(data);

    if (!order) {
      throw {
        status: 500,
        message: "주문을 생성하는 동안 오류가 발생했습니다.",
      };
    }

    return order;
  }

  static async getOrder({ data, page, uuid }) {
    //data : user or admin
    const perPage = 10;

    if (data === "admin") {
      const [orders, totalPage] = await Order.getPaginatedOrders(
        {},
        page,
        perPage
      );

      //사용자별 구매목록은 router에서
      if (!orders.length) {
        throw new Error("주문 내역이 없습니다.");
      }

      return { totalPage, orders };
    } else if (data === "user") {
      const [orders, totalPage] = await Order.getPaginatedPosts(
        { user_id: uuid },
        page,
        perPage
      );

      if (!orders.length) {
        throw new Error("사용자의 주문 내역이 없습니다.");
      }
      return { totalPage, orders };
    }
  }

  static async setOrder({ order_id, updateData, role }) {
    const order = await Order.findByOrderId(order_id);

    if (!order) {
      return { errorMessage: "주문 내역이 없습니다." };
    }

    if (role === "user") {
      if (
        order.order_status === "SHIPPED" ||
        order.order_status === "DELIVERED"
      ) {
        return { errorMessage: "배송이 시작되어 수정이 불가능합니다." };
      } else if (
        order.order_status === "ORDER_CONFIRMED" ||
        order.order_status === "PREPARING_FOR_SHIPMENT"
      ) {
        return await Order.update(order_id, updateData);
      }
    } else if (role === "admin") {
      return await Order.update(order_id, updateData);
    }
    // user 수정가능 주소/전화번호/이름/요청사항
    // admin 수정가능 주문상태
  }

  static async deleteOrder({ uuid, role }) {
    const order = await Order.findByOrderId(uuid);
    //uuid가 상품아이디로 사용되나?

    if (!order) {
      return { errorMessage: "주문 내역이 없습니다." };
    }

    if (role === "user") {
      await Order.delete({ order_id });

      return { cancelMessage: "주문이 취소되었습니다." };
    } else if (role === "admin") {
      await Order.delete({ order_id });

      return { cancelMessage: "주문이 취소되었습니다." };
    }

    return { errorMessage: "비회원은 접근할 수 없습니다." };
    //비회원도 uuid를 가지고 접근할 수 있나?
  }
}

export default OrderService;
