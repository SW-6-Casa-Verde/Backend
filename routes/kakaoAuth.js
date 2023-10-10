import { Router } from "express";
import passport from "passport";
import { createJWT } from "../utils/jwt";
const kakaoAuthRouter = Router();

// kakaoAuthRouter.post('/', passport.authenticate('local', { session: false }), (req, res, next) => {
//   setUserToken(res, req.user);
//   res.redirect('/');
// });

kakaoAuthRouter.get("/kakao", passport.authenticate("kakao", { scope: ["profile", "email"] }));

kakaoAuthRouter.get("/kakao/callback", passport.authenticate("kakao", { session: false }), (req, res, next) => {
  console.log("req.user:", req.user);
  createJWT(res, req.user);
  res.cookie("token", token, { httpOnly: true });
  res.status(200).json({ status: 200, message: "로그인 성공." });
  res.redirect("/");
});

export { kakaoAuthRouter };
