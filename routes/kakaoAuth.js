import { Router } from "express";
import passport from "passport";
import { createJWT } from "../utils/jwt";
import { AccountService } from "../services/account-service";
import asyncHandler from "../utils/asyncHandler";

const kakaoAuthRouter = Router();

kakaoAuthRouter.get("/kakao", passport.authenticate("kakao"));

kakaoAuthRouter.get(
  "/kakao/callback",
  passport.authenticate("kakao", { session: false }),
  asyncHandler(async (req, res) => {
    const { uuid, role, errorMessage } = await AccountService.googleLogin({ email: req.user.email, password: "KAKAO_OAUTH" });

    if (errorMessage) {
      throw { status: 404, message: errorMessage };
    }

    const token = await createJWT({ role, uuid });

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ status: 200, message: "로그인 성공." });
  })
);

export { kakaoAuthRouter };
