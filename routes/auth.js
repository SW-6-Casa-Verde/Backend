import { Router } from "express";
import passport from "passport";
import { createJWT } from "../utils/jwt";
import { AccountService } from "../services/account-service";
const authRouter = Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/google/callback", passport.authenticate("google", { session: false }), (req, res, next) => {
  console.log("req.user : ", req.user);
  const { email, password } = req.user;
  const token = createJWT(AccountService.googleLogin({ email, password })); // 여기도 account service의 login 사용하면 좋을 듯
  res.cookie("token", token, { httpOnly: true });
  res.redirect("/");
});

export { authRouter };
