import passport from "passport";
import session from "express-session";
import sessionConfig from "./sessionConfig";

import local from "./strategies/local";
import jwt from "./strategies/jwt";
import google from "./strategies/google";

// passport.serializeUser((user, done) => {
//   done(null, user);
//   console.log(user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

passport.use(local);
passport.use(jwt);
passport.use(google);

export { passport, session, sessionConfig };
