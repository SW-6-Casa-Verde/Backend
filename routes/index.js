import { Router } from "express";
import UserService from "../services/user-service";
import LoginService from "../services/login-service";
import validateUser from "../validators/userValidator";
import validateLogin from "../validators/loginValidator";
import validateEmail from "../validators/emailValidator";
import asyncHandler from "../utils/asyncHandler";
import jwtBlacklist from "../middlewares/jwt-blacklist";
import { verifyJWT } from "../utils/jwt";
const router = Router();

const { setBlacklist } = jwtBlacklist();

// 이메일 중복 검사
router.post(
  "/check-email-duplicate",
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const { error } = await validateEmail({ email });
    if (!email || error) {
      throw { status: 422, message: "요청한 값을 다시 확인해주세요." };
    }

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
  asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    const decode = await verifyJWT(token);
    if (decode.errorMessage) {
      const { status, errorMessage } = decode;
      throw { status, message: errorMessage };
    }
    // 다음 라우터로 못가나..?
    // 로그인 유지는 세션있어야 가능할듯..
    res
      .status(200)
      .json({ status: 200, message: "로그인 되어 있는 사용자입니다." });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    // 데이터 유효성 검사
    const { email, password } = req.body;
    // 토큰이 있다면 토큰으로 로그인 진행

    const { error, value } = await validateLogin({ email, password });
    if (error) throw { status: 400, message: "요청한 값을 다시 확인해주세요." };

    const isUser = await LoginService.loginUser(value);
    const success = isUser.authUserInfo;
    if (!success) {
      const { status, errorMessage } = isUser;
      throw { status, message: errorMessage };
    }

    const { token, authUserInfo } = isUser;
    // JWT를 쿠키에 설정
    // 쿠키를 주는 것까지는 했으니 세션에 담아두기 위해
    res.cookie("token", token, { httpOnly: true });
    res
      .status(200)
      .json({ status: 200, message: "로그인 성공.", data: authUserInfo });
  }),
);

router.post(
  "/logout",
  setBlacklist,
  asyncHandler(async (req, res, next) => {
    // JWT는 일반적으로 시간 기반과 무작위한 요소를 포함하여 생성된다.
    // 즉, 재로그인 한다고 블랙리스트의 토근 정보와 겹칠일이 없다.
    const token = req.cookies.token;
    const localBlackList = req.app.locals.blacklist;
    localBlackList.push(token);

    res.clearCookie("token");
    res.status(200).json({ status: 204, message: "로그아웃 성공." });
  }),
);

export default router;
