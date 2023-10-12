import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import urlSafeBase64 from "../../utils/urlSafeBase64";

const cookieExtractor = (req) => {
    const { token } = req.cookies;
    if (token) return token;
    // 뜯어서 에러 반환하는 로직이 어디있는지 모르겠다.
    else return { status: 401, message: "인증되지 않은 사용자" };
};

const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: urlSafeBase64(process.env.JWT_KEY)
};

const jwt = new JwtStrategy(jwtOptions, (payload, done) => {
    try {
        // verify 로직
        if (payload.message) {
            const { message, status } = payload;
            throw { message, status }
        }

        done(null, payload);
    } catch (error) {
        done(error, null);
    }
});

export default jwt;
