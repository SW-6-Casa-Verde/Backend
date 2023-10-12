import { Router } from "express";
import passport from "passport";
import { createJWT } from "../utils/jwt";
import { AccountService } from "../services/account-service";

const authRouter = Router();

// 네이버
authRouter.get("/naver", passport.authenticate("naver", { authType: "reprompt" }));

authRouter.get("/naver/callback", (req, res, next) => {
  passport.authenticate("naver", { session: false, failureRedirect: '/login' }, 
    async (err, user) => {
      if (err) {
        const { status, message } = err;
        return next({ status, message });
      }

      const { uuid, role, authorization } = user;
      const token = await createJWT({ uuid, role });

      const localAuthInfo = req.app.locals.authorization;
      localAuthInfo.authorization = authorization;

      res.status(200).json({ status: 200, message: "네이버 로그인 성공.", token: token });
    })(req, res, next);
  }
);

//구글
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user, info) => {
    if (err) {
      return next({ status: 404, message: err });
    }

    const { uuid, role, errorMessage } = await AccountService.login({ email: user.email, password: "GOOGLE_OAUTH" });

    if (errorMessage) {
      console.log(errorMessage);
      return next({ status: 404, message: errorMessage });
    }

    const token = await createJWT({ uuid, role });

    res.status(200).json({ status: 200, message: "구글 로그인 성공.", token: token });
  })(req, res, next);
});

//카카오
authRouter.get("/kakao", passport.authenticate("kakao"));

authRouter.get("/kakao/callback", (req, res, next) => {
  passport.authenticate("kakao", { session: false }, async (err, user, info) => {
    if (err) {
      return next({ status: 404, message: err });
    }

    const { uuid, role, errorMessage } = await AccountService.login({ email: user.email, password: "KAKAO_OAUTH" });

    if (errorMessage) {
      return next({ status: 404, message: errorMessage });
    }

    const token = await createJWT({ role, uuid });

    res.status(200).json({ status: 200, message: "카카오 로그인 성공.", token: token });
  })(req, res, next);
});

export { authRouter };
