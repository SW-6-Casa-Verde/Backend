import passport from "passport";
import session from "express-session";
import sessionConfig from "./sessionConfig";

import local from "./strategies/local";
import google from "./strategies/google";
import kakao from "./strategies/kakao";
import naver from "./strategies/naver";

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

passport.use(local);
passport.use(google);
passport.use(kakao);
passport.use(naver);

export { passport, session, sessionConfig };
