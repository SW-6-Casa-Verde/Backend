import { Router } from "express";
import passport, { Passport } from "passport";
const authRouter = Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/google/callback", passport.authenticate("google"), (req, res, next) => {
  console.log("req.user : ", req.user);
  const token = createJWT({ uuid: user.uuid, role: user.role });
  res.cookie("token", token, { httpOnly: true });
  res.redirect("/");
});

export { authRouter };
