import { Order } from "../db/models/order";
import { User } from "../db/models/User";

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

  static async getOrder(data, page, uuid) {
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
      //console.log(uuid);
      const user = await User.findByUserId(uuid);
      if (!user) {
        throw {
          status: 422,
          message: "사용자 ID가 필요합니다.",
        };
      }

      const [orders, totalPage] = await Order.getPaginatedOrders(
        { user_id: user },
        page,
        perPage
      );
      //console.log("에러나니", orders, totalPage);
      if (!orders.length) {
        throw new Error("사용자의 주문 내역이 없습니다.");
      }
      return { totalPage, orders };
    }
  }

  static async setOrder(order_id, updateData, role) {
    const order = await Order.findByOrderId(order_id);
    if (!order) {
      return { errorMessage: "주문 내역이 없습니다." };
    }
    console.log(order.order_status);

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
    // enum 적용이 안됨 order_status 오타나도 그대로 적용됨
    //배송상태 if문 적용안됨 db에는 오타도 그대로 터미널에서는
  }

  static async deleteOrder({ orderId, role }) {
    const order = await Order.findByOrderId(orderId);

    if (!order) {
      return { errorMessage: "주문 내역이 없습니다." };
    }

    if (role === "user") {
      if (
        order.order_status === "SHIPPED" ||
        order.order_status === "DELIVERED"
      ) {
        return { errorMessage: "배송이 시작되어 취소가 불가능합니다." };
      } else if (
        order.order_status === "ORDER_CONFIRMED" ||
        order.order_status === "PREPARING_FOR_SHIPMENT"
      ) {
        await Order.delete(orderId);

        return { cancelMessage: "주문이 취소되었습니다." };
      }
    } else if (role === "admin") {
      await Order.delete(orderId);

      return { cancelMessage: "주문이 취소되었습니다." };
    }
  }
}

export default OrderService;
