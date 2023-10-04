import { Router } from "express";
import UserService from "../services/userService";
import asyncHandler from "../utils/asyncHandler";
import validateUser from "../validators/userValidator";
const router = Router();

// 회원 가입 페이지 이동 ? (이거는 안쓸거같은데)
router.get("/sign-up", (req, res, next) => {
  // ...
});

// 이메일 중복 검사
router.post(
  "/check-email-duplicate",
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email)
      throw { status: 422, message: "요청한 값을 다시 확인해주세요." };

    const isEmailDuplicate = await UserService.checkEmailDuplicate(email);
    if (isEmailDuplicate) {
      const message = isEmailDuplicate.errorMessage;
      throw { status: 409, message: message };
    }
    res
      .status(200)
      .json({ status: 200, message: "사용 가능한 이메일 주소입니다." });
  }),
);

// 회원 가입 요청
router.post(
  "/sign-up",
  asyncHandler(async (req, res, next) => {
    // 유효성 검사
    const { error, value } = validateUser(req.body);
    // const { email, password, address, phone, name } = req.body;
    // const usr = {
    //     "email": "hell1@gmail.com",
    //     "password": "hell1hell1",
    //     "address": "서울특별시 구구 동동",
    //     "phone": "010-0000-0000",
    //     "name": ""
    // }
    const usr = req.body;
    // if (!error) throw { status: 422, message:'요청한 값을 다시 확인해주세요.' };

    const newUser = await UserService.addUser(usr);
    if (newUser.errorMessage) {
      const { status, errorMessage } = newUser;
      throw { status: status, message: errorMessage };
    }
    res
      .status(200)
      .json({ status: 200, message: "회원 가입이 완료되었습니다." });
  }),
);

export default router;
