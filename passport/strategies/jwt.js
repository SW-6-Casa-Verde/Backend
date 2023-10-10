import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import urlSafeBase64 from "../../utils/urlSafeBase64";

const cookieExtractor = (req) => {
    const { token } = req.cookies;
    return token;
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: urlSafeBase64(process.env.JWT_KEY)
};

const jwt = new JwtStrategy(jwtOptions, (payload, done) => {
    try {
        // verify 로직
        const sessionId = payload.sessionId;
        // 미들웨어로 등록됐는데 세션은...
        const sessionUser = sessionStore.get(sessionId);
        if (sessionUser) return done(null, sessionUser);
    } catch (error) {
        done(error, null);
    }
});

export default jwt;
