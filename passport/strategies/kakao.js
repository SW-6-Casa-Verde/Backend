import { Strategy as KakaoStrategy } from "passport-kakao";
import { AccountService } from "../../services";

const config = {
  clientID: process.env.kakao_clientID,
  callbackURL: "/auth/kakao/callback",
};

const kakao = new KakaoStrategy(config, async (accessToken, refreshToken, profile, done) => {
  const name = profile.displayName;
  const email = profile._json.kakao_account.email;

  try {
    const user = await AccountService.socialLogin({ name, email });

    done(null, {
      uuid: user.uuid,
      role: user.role,
    });
  } catch (e) {
    done(e, null);
  }
});

export default kakao;
