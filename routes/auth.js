import { Router } from "express";
import passport from "passport";
import { createJWT } from "../utils/jwt";
import { AccountService } from "../services/account-service";

const authRouter = Router();


// 네이버
authRouter.get("/naver", passport.authenticate("naver"));

authRouter.get("/naver/callback", 
  passport.authenticate("naver", { session: false, failureRedirect: '/login'}), 
    async (req, res, next) => {
      // console.log(req.query)
      const localAuthInfo = req.app.locals.authorization;
      const { accessToken, refreshToken, provider } = req.user.authorization;
      localAuthInfo.accessToken = accessToken;
      localAuthInfo.refreshToken = refreshToken;
      localAuthInfo.provider = provider;

      const { uuid, role } = req.user;
      console.log(req.user)
      const token = createJWT({ uuid, role });

      res.cookie("token", token, { httpOnly: true });
      res.redirect("/");
    }
);

//구글
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user, info) => {
    if (err) {
      return next({ status: 404, message: err });
    }

    const { uuid, role, errorMessage } = await AccountService.googleLogin({ email: user.email, password: "GOOGLE_OAUTH" });

    if (errorMessage) {
      console.log(errorMessage);
      return next({ status: 404, message: errorMessage });
    }

    const token = await createJWT({ uuid, role });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  })(req, res, next);
});

//카카오
authRouter.get("/kakao", passport.authenticate("kakao"));

authRouter.get("/kakao/callback", (req, res, next) => {
  passport.authenticate("kakao", { session: false }, async (err, user, info) => {
    if (err) {
      return next({ status: 404, message: err });
    }

    const { uuid, role, errorMessage } = await AccountService.googleLogin({ email: user.email, password: "KAKAO_OAUTH" });

    if (errorMessage) {
      return next({ status: 404, message: errorMessage });
    }

    const token = await createJWT({ role, uuid });

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ status: 200, message: "로그인 성공." });
  })(req, res, next);
});

export { authRouter };
