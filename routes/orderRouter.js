import { Router } from "express";
import OrderService from "../services/orderService";
const orderRouter = Router();

//orderItem 미들웨어 구매상품까지 같이 ?
orderRouter.post("/order", async (req, res, next) => {
  try {
    const {
      id,
      total_price,
      name,
      address,
      phone,
      request,
      pay_Method,
      order_status,
      user_id,
      timestamp,
    } = req.body;
    const data = { ...req.body };
    const newOrder = await OrderService.newOrder(data);

    return res.status(201).json({
      status: 201,
      data: newOrder,
    });
  } catch (err) {
    next(err);
  }
});

export default orderRouter;
