import { Router } from "express";
import passport, { Passport } from "passport";
import { createJWT } from "../utils/jwt";
const authRouter = Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/google/callback", passport.authenticate("google", { session: false }), (req, res, next) => {
  console.log("req.user : ", req.user);
  const token = createJWT({ uuid: req.user.uuid, role: req.user.role });
  res.cookie("token", token, { httpOnly: true });
  res.redirect("/");
});

export { authRouter };
