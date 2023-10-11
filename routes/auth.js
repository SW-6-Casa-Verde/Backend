import { Router } from "express";
import passport from "passport";
import { createJWT } from "../utils/jwt";
import { AccountService } from "../services/account-service";
import asyncHandler from "../utils/asyncHandler";
const authRouter = Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  asyncHandler(async (req, res) => {
    console.log("req.user : ", req.user);
    const { uuid, role, errorMessage } = await AccountService.googleLogin({ email: req.user.email, password: "GOOGLE_OAUTH" });
    if (errorMessage) {
      console.log(errorMessage);
      throw { status: 404, message: errorMessage };
    }
    const token = createJWT({ uuid, role }); // 여기도 account service의 login 사용하면 좋을 듯
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  })
);

export { authRouter };
