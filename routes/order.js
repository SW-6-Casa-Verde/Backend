import { Router } from "express";
import OrderService from "../services/orderService";
import asyncHandler from "../utils/asyncHandler";
const router = Router();

//orderItem 미들웨어 구매상품까지 같이 ?
router.post(
  "/",
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

    res.status(201).json({
      status: 201,
      data: newOrder,
    });
  })
);

export default router;
