import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import urlSafeBase64 from "../../utils/urlSafeBase64";

const requestHeaders = (req) => {
    const { authorization } = req.headers;
    return authorization;
}

const jwtOptions = {
    secretOrKey: urlSafeBase64(process.env.JWT_KEY),
    jwtFromRequest: requestHeaders,
    ignoreExpiration: true,
    passReqToCallback: true
};

const jwt = new JwtStrategy(jwtOptions, (req, payload, done) => {
    try {
        // 토큰 자체가 없을 때, token에 이상한 값이 왔을 때 처리가 안되네
        // console.log(req, payload)
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token || !payload) {
            console.log("sad")
            return done(null, false, { status: 441, message: "Unauthorized" });
            // throw { status: 401, message: "Unauthorized" };
        }

        const localBlackList = req.app.locals.blacklist;
        if (localBlackList.has(payload.jti)) {
            throw { status: 401, message: "Token revoked" };
        }

        const expirationDate = payload.exp * 1000;
        const currentTime = Date.now();
        // 토큰 만료 처리
        if ((expirationDate < currentTime)) {
            // createJWT(payload) 만료된 토큰을 넣을라고 다시 sign 하는게 맞나?
            localBlackList.add(payload.jti);
            console.log(localBlackList);
            throw { status: 401, message: "토큰 인증이 만료되었습니다." };
        }

        done(null, payload);
    } catch (error) {
        done(error, null);
    }
});

export default jwt;
