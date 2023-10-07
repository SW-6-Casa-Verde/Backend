import { Router } from "express";
import { OrderService } from "../services";
import asyncHandler from "../utils/asyncHandler";
import { validateOrder } from "../validators";
const router = Router();

//orderItem 미들웨어 구매상품까지 같이 ?
//주문하기
router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    const { error, value } = await validateOrder(req.body);

    if (error) throw { status: 422, message: "주문정보를 다시 확인해주세요." };
    console.log(req.body);

    const newOrder = await OrderService.addOrder(value);

    res.status(201).json({
      status: 201,
      data: newOrder,
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
    //res.params가 아니라 req.user가 되나?
    console.log(orderId, role);

    if (role === "admin") {
      await OrderService.deleteOrder({ orderId, role });

      return res.status(200).json({
        status: 200,
        message: "주문이 취소되었습니다.",
      });
    } else if (role === "user") {
      await OrderService.deleteOrder({ orderId, role });

      return res.status(200).json({
        status: 200,
        message: "주문이 취소되었습니다.",
      });
    }
    return { errorMessage: "비회원은 접근할 수 없습니다." };
  })
);

export default router;
