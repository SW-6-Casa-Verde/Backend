import { Router } from "express";
import passport from "passport";
import { createJWT } from "../utils/jwt";
import { AccountService } from "../services/account-service";
const authRouter = Router();

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

export { authRouter };
