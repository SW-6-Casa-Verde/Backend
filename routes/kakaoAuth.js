import { Router } from "express";
import passport from "passport";
import { createJWT } from "../utils/jwt";

const authRouter = Router();

authRouter.get("/kakao", passport.authenticate("kakao"));

authRouter.get("/kakao/callback", passport.authenticate("kakao", { failureRedirect: "/" }), (req, res) => {
  const { uuid, role } = req.user;
  const token = createJWT({ uuid, role });

  res.cookie("token", token, { httpOnly: true });
  res.redirect("/");
});

export { authRouter };
