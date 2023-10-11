import { Strategy as KakaoStrategy } from "passport-kakao";
import { User } from "../../db";
import { UserService } from "../../services/user-service";

const config = {
  clientID: process.env.kakao_clientID,
  callbackURL: "/api/auth/kakao/callback",
};

async function findOrCreateUser({ name, email }) {
  const user = await User.findByEmail(email);

  if (user) return user;

  const created = await UserService.addUser({
    name,
    email,
    password: "KAKAO_OAUTH",
    is_sns_user: true,
  });

  return created;
}

export default new KakaoStrategy(config, async (accessToken, refreshToken, profile, done) => {
  const name = profile.displayName;
  const email = profile._json.kakao_account.email;

  if (!email) {
    return done("email 정보 제공에 동의해주세요", null);
  }

  try {
    const user = await findOrCreateUser({ name, email });
    done(null, {
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (e) {
    done(e, null);
  }
});
