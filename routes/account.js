import { Router } from "express";
import { UserService, AccountService } from "../services";
import { validateUser, validateLogin, validateEmail } from "../validators";
import asyncHandler from "../utils/asyncHandler";
import jwtLoginRequired from "../middlewares/jwt-login-required";
import { verifyJWT } from "../utils/jwt";

const accountRouter = Router();
const { setBlacklist } = jwtLoginRequired();

// 이메일 중복 검사
accountRouter.post(
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
    res.status(200).json({ status: 200, message: "사용 가능한 이메일 주소입니다." });
  })
);

// 회원 가입 요청
accountRouter.post(
  "/sign-up",
  asyncHandler(async (req, res, next) => {
    // 유효성 검사
    const { error, value } = await validateUser(req.body);
    if (error) throw { status: 422, message: "요청한 값을 다시 확인해주세요." };

    const { status, errorMessage } = await UserService.addUser(value);
    if (errorMessage) {
      throw { status, message: errorMessage };
    }

    res.status(200).json({ status: 200, message: "회원 가입이 완료되었습니다." });
  })
);

accountRouter.get(
  "/login",
  asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    const decodedToken = await verifyJWT(token);
    if (decodedToken.errorMessage) {
      const { status, errorMessage } = decodedToken;
      throw { status, message: errorMessage };
    }
    // 다음 라우터로 못가나..?
    // 로그인 유지는 세션있어야 가능할듯..
    const authUserInfo = await UserService.getUserInfo(decodedToken.uuid);
    if (authUserInfo.errorMessage) {
      const { status, errorMessage } = authUserInfo;
      throw { status, message: errorMessage };
    }

    res.status(200)
      .json({ 
        status: 200, 
        message: "로그인 되어 있는 사용자입니다.", 
        data: authUserInfo 
      });
  })
);

accountRouter.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    // 데이터 유효성 검사
    const { email, password } = req.body;
    // 토큰이 있다면 토큰으로 로그인 진행

    const { error, value } = await validateLogin({ email, password });
    if (error) throw { status: 400, message: "요청한 값을 다시 확인해주세요." };

    const user = await AccountService.login(value);
    const { token } = user;
    if (!token) {
      const { status, errorMessage } = user;
      throw { status, message: errorMessage };
    }

    // JWT를 쿠키에 설정
    // 쿠키를 주는 것까지는 했으니 세션에 담아두기 위해
    // 세션 구현 이후 post에서 data 주는거 get으로 옮기기
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ status: 200, message: "로그인 성공." });
  })
);

accountRouter.post(
  "/logout",
  setBlacklist,
  asyncHandler(async (req, res, next) => {
    // JWT는 일반적으로 시간 기반과 무작위한 요소를 포함하여 생성된다.
    // 즉, 재로그인 한다고 블랙리스트의 토근 정보와 겹칠일이 없다.
    const token = req.cookies.token;
    const localBlackList = req.app.locals.blacklist;

    await AccountService.logout({ token, localBlackList });

    res.clearCookie("token");
    res.status(200).json({ status: 204, message: "로그아웃 성공." });
  })
);

export { accountRouter };
