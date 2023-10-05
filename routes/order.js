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

    // if (!data)
    //   throw { status: 422, message: "값이 제대로 입력되지않았습니다." };
    console.log(req.body);

    const newOrder = await OrderService.newOrder({
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
    const { id, role } = req.body;
    const page = req.query;
    if (!page) {
      page = 1;
    }

    if (role === "admin") {
      const orders = await OrderService.getOrder("admin", Number(page));

      if (!orders)
        throw { status: 422, message: "요청한 값을 다시 확인해주세요." };

      return res.status(200).json({
        status: 200,
        message: "주문 목록 관리자 페이지입니다.",
        totalPage: orders.totalPage,
        data: orders.order,
      });
    } else if (role === "user") {
      const orders = await OrderService.getOrder(id);
      return res.status(200).json({
        status: 200,
        message: "주문 목록 구매자 페이지입니다.",
        data: orders,
      });
    }
  })
);

router.patch(
  "/edit",
  asyncHandler(async (req, res) => {})
);

export default router;
