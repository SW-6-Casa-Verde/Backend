import { Router } from "express";
import UserService from "../services/user-service";
import validateUser from "../validators/userValidator";
import asyncHandler from "../utils/asyncHandler";
const router = Router();

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
    const { error, value } = await validateUser(req.body);
    if (error) throw { status: 422, message: "요청한 값을 다시 확인해주세요." };

    const newUser = await UserService.addUser(value);
    if (newUser.errorMessage) {
      const { status, errorMessage } = newUser;
      throw { status, message: errorMessage };
    }
    res
      .status(200)
      .json({ status: 200, message: "회원 가입이 완료되었습니다." });
  }),
);

router.get(
  "/login",
  asyncHandler(async (req, res, next) => {}),
);

router.post(
  "/login",
  asyncHandler(async (req, res, next) => {}),
);

router.post(
  "/logout",
  asyncHandler(async (req, res, next) => {}),
);

module.exports = router;
