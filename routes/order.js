import { Router } from "express";
import { OrderService, OrderItemService, UserService } from "../services";
import asyncHandler from "../utils/asyncHandler";
import { validateOrder, validateNonMemberOrder, validateAdminOrderUpdate, validateUserOrderUpdate, validateOrderDelete } from "../validators";
import jwtAdminRole from "../middlewares/jwt-admin-role";
import jwtLoginRequired from "../middlewares/jwt-login-required";
import { sendOrderConfirmationEmail } from "../utils/mailer";

const orderRouter = Router();
const { setBlacklist } = jwtLoginRequired();

//주문하기
orderRouter.post(
  "/",
  asyncHandler(async (req, res, next) => {
    const non_member_id = await UserService.getNonMemberId();
    let userObjectId = non_member_id.toHexString();
    const { uuid, data } = req.body;

    if (uuid) {
      const userInfo = await UserService.getUserInfo(uuid);
      if (userInfo.errorMessage) {
        throw {
          status: 404,
          message: userInfo.errorMessage,
        };
      }
      userObjectId = userInfo._id.toHexString();
    }

    const { error } = await validateOrder(data);

    if (error) throw { status: 422, message: "주문정보를 다시 확인해주세요." };

    const { orderItems, ...orderData } = data;

    const newOrder = await OrderService.addOrder({ ...orderData, user_id: userObjectId });

    if (newOrder.errorMessage) {
      throw {
        status: 404,
        message: newOrder.errorMessage + "ooo",
      };
    }

    const newOrderItems = await Promise.all(
      orderItems.map(async (orderItem) => {
        // 주문 상품 생성
        const orderedItems = await OrderItemService.addOrderItem({
          ...orderItem,
          order_id: newOrder._id, // 새로 생성된 주문의 _id를 사용
        });
        return orderedItems;
      })
    );

    if (newOrderItems.errorMessage) {
      throw {
        status: 404,
        message: newOrderItems.errorMessage,
      };
    }
    const { _id, email, name, pay_method, total_price } = newOrder;

    sendOrderConfirmationEmail(_id, email, name, pay_method, total_price);

    res.status(201).json({
      status: 201,
      data: newOrder,
      items: newOrderItems,
    });
  })
);

//주문조회 (사용자/관리자)
orderRouter.get(
  "/:page",
  setBlacklist,
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.params;
    const { role, uuid } = req.user;

    if (isNaN(page) || parseInt(page) <= 0) {
      throw { status: 400, message: "Invalid page parameter" };
    }

    if (role === "ADMIN") {
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
    } else if (role === "USER") {
      const userInfo = await UserService.getUserInfo(uuid);
      const userId = userInfo._id.toHexString();

      if (userInfo.errorMessage)
        throw {
          status: 422,
          message: userInfo.errorMessage,
        };

      const { orders, totalPage } = await OrderService.getOrder({ user_id: userId }, Number(page));

      if (orders.errorMessage)
        throw {
          status: 422,
          message: orders.errorMessage,
        };

      const getOrders = await Promise.all(
        orders.map(async (order) => {
          const orderItems = await OrderItemService.getOrderItem(order._id);

          return { order, orderItems };
        })
      );

      return res.status(200).json({
        status: 200,
        message: "주문 목록 구매자 페이지입니다.",
        data: getOrders,
        totalPage: totalPage,
      });
    }
  })
);

// 주문 조회 (비회원)
orderRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { id, name } = req.query;

    const { error } = await validateNonMemberOrder({ id, name });

    if (error) throw { status: 422, message: "주문 조회 정보를 다시 확인해주세요." };

    const orders = await OrderService.getNoneMemberOrder(id, name);

    if (orders.errorMessage)
      throw {
        status: 422,
        message: orders.errorMessage,
      };

    return res.status(200).json({
      status: 200,
      message: "비회원 주문 목록입니다.",
      data: orders,
    });
  })
);

// admin 주문 수정
orderRouter.patch(
  "/admin/:id",
  jwtAdminRole,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    //받아오는 상품id 예외처리, 수정내역 예외처리
    const { error } = await validateAdminOrderUpdate({ id, ...data });

    if (error) throw { status: 422, message: "주문 수정 정보를 다시 확인해주세요." };

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

// user 주문 수정
orderRouter.patch(
  "/user/:id",
  setBlacklist,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const { error } = await validateUserOrderUpdate({ id, ...data });

    if (error) throw { status: 422, message: "주문 수정 정보를 다시 확인해주세요." };

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

// admin 주문취소 라우터
orderRouter.delete(
  "/admin/:id",
  jwtAdminRole,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { error } = await validateOrderDelete({ id });

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
