import { Router } from "express";
import OrderService from "../services/order-service";
import OrderItemService from "../services/orderItem-service";
import asyncHandler from "../utils/asyncHandler";
import validateOrder from "../validators/orderValidator";
const router = Router();

//orderItem 미들웨어 구매상품까지 같이 ?
// 사용자가 구매하기를 누르고 주문내역 보여줄때 res.render
//주문하기
router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    const { error, value } = await validateOrder(req.body);
    const { orderItems, ...orderData } = value;

    console.log(orderItems, "000", orderData);

    if (error) throw { status: 422, message: "주문정보를 다시 확인해주세요." };

    const newOrder = await OrderService.addOrder(orderData);

    const orderedItems = await Promise.all(
      orderItems.map(async (orderItem) => {
        // 주문 아이템 생성
        const newOrderItem = await OrderItemService.addOrderItem({
          ...orderItem,
          order_id: newOrder._id, // 새로 생성된 주문의 _id를 사용
        });
        return newOrderItem;
      })
    );
    console.log(orderedItems);

    const newOrderItem = await OrderItemService.addOrderItem(orderedItems);

    res.status(201).json({
      status: 201,
      data: newOrder,
      items: newOrderItem,
    });
  })
);

//주문조회 (사용자/관리자)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { uuid, role, page = 1 } = req.query;

    if (role === "admin") {
      const orders = await OrderService.getOrder("admin", Number(page), uuid);

      if (!orders)
        throw {
          status: 422,
          message: "주문 내역을 가져오는 데 문제가 있습니다.",
        };

      return res.status(200).json({
        status: 200,
        message: "주문 목록 관리자 페이지입니다.",
        totalPage: orders.totalPage,
        data: orders.orders,
      });
    } else if (role === "user") {
      const orders = await OrderService.getOrder("user", Number(page), uuid);

      if (!orders)
        throw {
          status: 422,
          message: "주문 내역을 가져오는 데 문제가 있습니다.",
        };

      return res.status(200).json({
        status: 200,
        message: "주문 목록 구매자 페이지입니다.",
        data: orders,
      });
    } else {
      throw {
        status: 422,
        message: "올바르지 않은 역할(role)입니다.",
      };
    }
  })
);

router.patch(
  "/",
  asyncHandler(async (req, res) => {
    const { orderId, data, role } = req.body;

    if (role === "admin") {
      const update = await OrderService.setOrder(orderId, data, role);

      return res.status(200).json({
        status: 200,
        message: "배송상태가 수정되었습니다.",
        data: update,
      });
    } else if (role === "user") {
      const update = await OrderService.setOrder(orderId, data, role);
      console.log(update);

      return res.status(200).json({
        status: 200,
        message: "주문내역이 수정되었습니다.",
        data: update,
      });
    }
  })
);

router.delete(
  "/:orderId",
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { role } = req.query;
    //res.params가 아니라 req.user가 되나? ->  사용자 정보와 관련된 경우에 사용,  일반적으로 로그인된 사용자의 정보를 포함

    let order = null;
    if (role === "admin") {
      order = await OrderService.deleteOrder({ orderId, role });
    } else if (role === "user") {
      order = await OrderService.deleteOrder({ orderId, role });
    }

    if (order.errorMessage) {
      throw { status: 404, message: order.errorMessage };
    }

    return res.status(200).json({
      status: 200,
      message: order.message,
    });
  })
);

export default router;
