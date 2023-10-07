import { Router } from "express";
import OrderService from "../services/order-service";
import OrderItemService from "../services/orderItem-service";
import asyncHandler from "../utils/asyncHandler";
import validateOrder from "../validators/orderValidator";
//import jwtAdminRole from "../middleware/jwt-admin-role";
import jwtBlacklist from "../middleware/jwt-blacklist";
const router = Router();

//orderItem 미들웨어 구매상품까지 같이 ?
// 사용자가 구매하기를 누르고 주문내역 보여줄때 res.render
//주문하기
router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    const { error, value } = await validateOrder(req.body);
    const { orderItems, ...orderData } = value;

    if (error) throw { status: 422, message: "주문정보를 다시 확인해주세요." };

    const newOrder = await OrderService.addOrder(orderData);

    if (newOrder.errorMessage) {
      throw {
        status: 404,
        message: newOrder.errorMessage,
      };
    }

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

    const newOrderItem = await OrderItemService.addOrderItem(orderedItems);

    if (newOrderItem.errorMessage) {
      throw {
        status: 404,
        message: newOrderItem.errorMessage,
      };
    }

    // res.render로 수정
    res.status(201).json({
      status: 201,
      data: newOrder,
      items: newOrderItem,
    });
  })
);

//주문조회 (사용자/관리자) => 권한은 필요가 없음 => 관리자인지 사용자인지 확인 => 토큰이 있는지만 확인하면 => 블랙리스트 미들웨어
router.get(
  "/",
  jwtBlacklist,
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.params;

    if (role === "admin") {
      const orders = await OrderService.getOrder({}, Number(page));

      if (orders.errorMessage)
        throw {
          status: 422,
          message: orders.errorMessage,
        };

      return res.status(200).json({
        status: 200,
        message: "주문 목록 관리자 페이지입니다.",
        totalPage: orders.totalPage,
        data: orders.orders,
      });
    } else if (role === "user") {
      const orders = await OrderService.getOrder(
        { user_id: req.user.uuid },
        Number(page)
      );

      if (orders.errorMessage)
        throw {
          status: 422,
          message: orders.errorMessage,
        };

      return res.status(200).json({
        status: 200,
        message: "주문 목록 구매자 페이지입니다.",
        data: orders,
      });
    }
  })
);

//user, admin 따로 경로 만들기
router.patch(
  "/",
  asyncHandler(async (req, res) => {
    const { orderId, data, role } = req.body;

    if (role === "admin") {
      const update = await OrderService.setOrder(orderId, data, role);

      if (update.errorMessage)
        throw {
          status: 422,
          message: update.errorMessage,
        };

      return res.status(200).json({
        status: 200,
        message: "배송상태가 수정되었습니다.",
        data: update,
      });
    } else if (role === "user") {
      const update = await OrderService.setOrder(orderId, data, role);
      // console.log(update);

      if (update.errorMessage)
        throw {
          status: 422,
          message: update.errorMessage,
        };

      return res.status(200).json({
        status: 200,
        message: "주문내역이 수정되었습니다.",
        data: update,
      });
    }
  })
);

// user, admin 주문삭제 라우터 따로 만들기
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
