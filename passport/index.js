import passport from "passport";
import session from "express-session";
import sessionConfig from "./sessionConfig";

import local from "./strategies/local";
import jwt from "./strategies/jwt";

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(local);
passport.use(jwt);

export { passport, session, sessionConfig };
