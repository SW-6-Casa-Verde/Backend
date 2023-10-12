import { Router } from "express";
import passport from "passport";
import { UserService, AccountService } from "../services";
import { validateUser, validateEmail } from "../validators";
import asyncHandler from "../utils/asyncHandler";
import jwtLoginRequired from "../middlewares/jwt-login-required";
import { createJWT, verifyJWT } from "../utils/jwt";

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
    if (errorMessage) throw { status, message: errorMessage };

    res.status(200).json({ status: 200, message: "회원 가입이 완료되었습니다." });
  })
);

accountRouter.get(
  "/login",
  setBlacklist,
  asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    // 토큰이 없어도 에러는 아님. 
    let tokenUuid = null;
    if (token) {
      const decodedToken = await verifyJWT(token);
      if (!decodedToken.errorMessage) tokenUuid = decodedToken.uuid;
    }

    // 토큰 값 없으면 미들웨어 종료
    if (!tokenUuid) {
      return res.status(200).json({ 
        status: 200, 
        message: "OK",
      });
    }

    const authUserInfo = await UserService.getUserInfo(tokenUuid);
    if (authUserInfo.errorMessage) {
      const { status, errorMessage } = authUserInfo;
      throw { status, message: errorMessage };
    }

    res.status(200)
      .json({ 
        status: 200, 
        message: "로그인 되어 있는 사용자입니다.", 
        data: { uuid: authUserInfo.uuid }
      });
  })
);

accountRouter.post(
  "/login",
  passport.authenticate('local', { session: false }),
  asyncHandler(async (req, res, next) => {
    const { role, uuid } = req.user; 
    const token = await createJWT({ role, uuid });

    res.status(200)
      .json({ 
        status: 200, 
        message: "로그인 성공.", 
        token: token 
      });
  })
);

accountRouter.post(
  "/logout",
  setBlacklist,
  asyncHandler(async (req, res, next) => {
    // JWT는 일반적으로 시간 기반과 무작위한 요소를 포함하여 생성된다.
    // 서버에서 jwt 토큰을 제거는 할 수 있을지언정 만료되지 않은 토큰이면 탈취당하면 악용 가능
    // 예방 차원에서 블랙리스트 운용
    const token = req.user;
    const localBlackList = req.app.locals.blacklist;
    req.app.locals.authorization = {};

    await AccountService.logout({ token, localBlackList });

    res.status(200).json({ status: 204, message: "로그아웃 성공." });
  })
);

export { accountRouter };
