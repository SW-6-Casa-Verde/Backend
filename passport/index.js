import passport from "passport";
import session from "express-session";
import sessionConfig from "./sessionConfig";

import local from "./strategies/local";
import jwt from "./strategies/jwt";
import kakao from "./strategies/kakao";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(local);
passport.use(jwt);
passport.use(kakao);

export { passport, session, sessionConfig };
