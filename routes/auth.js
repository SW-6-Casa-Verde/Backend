import { Router } from "express";
import passport from "passport";
import asyncHandler from "../utils/asyncHandler";
import { createJWT } from "../utils/jwt";

const authRouter = Router();

// reprompt, reauthenticate , { authType: "reprompt" }
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

export { authRouter };
