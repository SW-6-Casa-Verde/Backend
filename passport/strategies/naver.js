import { Strategy as NaverStrategy } from "passport-naver-v2";
import { AccountService } from "../../services";

const config = {
    clientID: process.env.naver_clientID,
    clientSecret: process.env.naver_clientSecret,
    callbackURL: '/api/auth/naver/callback',
}

const naver = new NaverStrategy(config, 
    async (accessToken, refreshToken, profile, done) => {
        try {
            const { _json } = profile;
            if (_json.message !== 'success') throw { status: 401, message: "네이버 인증 실패" };
            
            const naverAuth = await AccountService.socialNaverLogin(_json.response);
            if (naverAuth.errorMessage) {
                const { status, errorMessage } = naverAuth;
                throw { status, message: errorMessage };
            }

            const { uuid, role } = naverAuth;
            const user = { 
                uuid, 
                role,
                authorization: { 
                    accessToken, 
                    refreshToken, 
                    provider: profile.provider 
                }
            }

            done(null, user);
        } catch (error) {
            done(error, null);
        }
})

export default naver;
