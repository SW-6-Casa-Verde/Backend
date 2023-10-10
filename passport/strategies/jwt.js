import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import urlSafeBase64 from "../../utils/urlSafeBase64";

const cookieExtractor = (req) => {
    const { token } = req.cookies;
    return token;
};

const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: urlSafeBase64(process.env.JWT_KEY)
};

const jwt = new JwtStrategy(jwtOptions, (payload, done) => {
    try {
        // verify 로직
        console.log(payload)
        done(null, payload)
    } catch (error) {
        done(error, null);
    }
});

export default jwt;
