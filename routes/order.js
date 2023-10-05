import { Router } from "express";
import OrderService from "../services/orderService";
import asyncHandler from "../utils/asyncHandler";
const router = Router();

//orderItem 미들웨어 구매상품까지 같이 ?
//주문하기
router.post(
  "/buy",
  asyncHandler(async (req, res, next) => {
    const {
      total_price,
      name,
      address,
      phone,
      request,
      pay_Method,
      order_status,
      user_id,
    } = req.body;

    if (!total_price || !name || !address || !phone || !user_id) {
      return res.status(422).json({
        status: 422,
        message: "요청한 값을 다시 확인해주세요.",
      });
    }
    console.log(req.body);

    const newOrder = await OrderService.addOrder({
      total_price,
      name,
      address,
      phone,
      request,
      pay_Method,
      order_status,
      user_id,
    });

    console.log(newOrder);
    res.status(201).json({
      status: 201,
      data: newOrder,
    });
  })
);

//주문조회 (사용자/관리자)
router.get(
  "/check",
  asyncHandler(async (req, res) => {
    const { role, id } = req.body;
    let page = req.query.page || 1; // 기본 페이지 값 설정

    if (role === "admin") {
      const orders = await OrderService.getOrder("admin", Number(page));

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
      if (!id) {
        throw {
          status: 422,
          message: "사용자 ID가 필요합니다.",
        };
      }
      const orders = await OrderService.getOrder(id);

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
  "/edit",
  asyncHandler(async (req, res) => {
    const { id, data, role } = req.body;

    if (role === "admin") {
      const update = await OrderService.setOrder({ id, data, role });

      return res.status(200).json({
        status: 200,
        message: "배송상태가 수정되었습니다.",
        data: update,
      });
    } else if (role === "user") {
      const update = await OrderService.setOrder({ id, data, role });

      return res.status(200).json({
        status: 200,
        message: "주문내역이 수정되었습니다.",
        data: update,
      });
    }
  })
);

router.delete(
  "/delete",
  asyncHandler(async (req, res) => {
    const { orderId, role, currentId } = req.body;

    if (role === "admin") {
      await OrderService.deleteOrder({ orderId, role });

      return res.status(200).json({
        status: 200,
        message: "주문이 취소되었습니다.",
      });
    } else if (role === "user") {
      await OrderService.deleteOrder({ orderId, role, currentId });

      return res.status(200).json({
        status: 200,
        message: "주문이 취소되었습니다.",
      });
    }
  })
);

export default router;
