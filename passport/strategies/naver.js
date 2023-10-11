import { Strategy as NaverStrategy } from "passport-naver-v2";
import { AccountService } from "../../services";

const config = {
    clientID: process.env.naver_clientID,
    clientSecret: process.env.naver_clientSecret,
    callbackURL: `${process.env.DEV_HOST}/auth/naver/callback`,
}

const naver = new NaverStrategy(config, 
    async (accessToken, refreshToken, profile, done) => {
        try {
            const { _json } = profile;
            if (_json.message !== 'success') throw { status: 401, message: "네이버 인증 실패" };

            const naverAuth = await AccountService.socialNaverLogin(_json.response, accessToken);
            if (naverAuth.errorMessage) {
                const { status, errorMessage } = naverAuth;
                throw { status, message: errorMessage };
            }

            naverAuth.authorization = { accessToken, refreshToken, provider: profile.provider }

            done(null, naverAuth);
        } catch (error) {
            done(error, null);
        }
})

export default naver;
