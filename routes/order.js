import { Router } from "express";
import { OrderService, OrderItemService } from "../services";
import asyncHandler from "../utils/asyncHandler";
import {
  validateOrder,
  validateAdminOrderUpdate,
  validateUserOrderUpdate,
  validateOrderDelete,
} from "../validators";
import jwtAdminRole from "../middlewares/jwt-admin-role";
import jwtLoginRequired from "../middlewares/jwt-login-required";

const orderRouter = Router();
const { setBlacklist } = jwtLoginRequired();

//주문하기
orderRouter.post(
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

    const newOrderItems = await Promise.all(
      orderItems.map(async (orderItem) => {
        // 주문 아이템 생성
        const orderedItems = await OrderItemService.addOrderItem({
          ...orderItem,
          order_id: newOrder._id, // 새로 생성된 주문의 _id를 사용
        });
        console.log(orderedItems);
        return orderedItems;
      })
    );

    if (newOrderItems.errorMessage) {
      throw {
        status: 404,
        message: newOrderItems.errorMessage,
      };
    }
    // 사용자가 구매하기를 누르고 주문내역 보여줄때 res.render
    // res.render로 수정 render안됨 템플린엔지으로 html해야됨
    res.status(201).json({
      status: 201,
      data: newOrder,
      items: newOrderItems,
    });
  })
);

//주문조회 (사용자/관리자) => 권한은 필요가 없음 => 관리자인지 사용자인지 확인 => 토큰이 있는지만 확인하면 => 블랙리스트 미들웨어
orderRouter.get(
  "/:page",
  setBlacklist,
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.params;
    const { role } = req.user;
    // 받아오는 페이지 예외처리 -> page가 전체 페이지 수를 넘기면 어떻게 하니 -> 페이지 처리 및 예외 처리: 페이지가 전체 페이지 수를 넘어갈 때의 예외 처리
    console.log(page);
    if (isNaN(page) || parseInt(page) <= 0) {
      throw { status: 400, message: "Invalid page parameter" };
    }

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
// 권한을 따로 줘야함 -> admin
orderRouter.patch(
  "/admin/:id",
  jwtAdminRole,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    //받아오는 상품id 예외처리, 수정내역 예외처리

    const { error } = await validateAdminOrderUpdate({ id, ...data });

    if (error)
      throw { status: 422, message: "주문 수정 정보를 다시 확인해주세요." };

    const update = await OrderService.setOrder(id, data, "admin");

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
  })
);

//user, admin 따로 경로 만들기
// 권한을 따로 줘야함 -> user
orderRouter.patch(
  "/user/:id",
  setBlacklist,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    //받아오는 상품id 예외처리, 수정내역 예외처리
    const { error } = await validateUserOrderUpdate({ id, ...data });

    if (error)
      throw { status: 422, message: "주문 수정 정보를 다시 확인해주세요." };

    const update = await OrderService.setOrder(id, data, "user");

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
  })
);

//!!! order삭제하고 orderITem 삭제하고,,, 번거롭,, 방법? look-up?
// admin 주문취소 라우터
orderRouter.delete(
  "/admin/:id",
  jwtAdminRole,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { error } = await validateOrderDelete({ id });
    console.log(id);
    console.log(error);

    if (error) throw { status: 422, message: "주문 id를 다시 확인해주세요." };

    // 주문 내역 삭제
    const order = await OrderService.deleteOrder(id, "admin");

    if (order.errorMessage) {
      throw { status: 404, message: order.errorMessage };
    }

    //주문상품 삭제
    const orderItem = await OrderItemService.deleteOrderItem(id);

    if (orderItem.errorMessage) {
      throw {
        status: 404,
        message: orderItem.errorMessage,
      };
    }

    return res.status(200).json({
      status: 200,
      message: order.message,
    });
  })
);

// user 주문취소 라우터
orderRouter.delete(
  "/user/:id",
  setBlacklist,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { error } = await validateOrderDelete({ id });

    if (error) throw { status: 422, message: "주문 id를 다시 확인해주세요." };

    // 주문 내역 삭제
    const order = await OrderService.deleteOrder(id, "user");

    if (order.errorMessage) {
      throw { status: 404, message: order.errorMessage };
    }

    //주문상품 삭제
    const orderItem = await OrderItemService.deleteOrderItem(id);

    if (orderItem.errorMessage) {
      throw {
        status: 404,
        message: orderItem.errorMessage,
      };
    }

    return res.status(200).json({
      status: 200,
      message: order.message,
    });
  })
);

export { orderRouter };
