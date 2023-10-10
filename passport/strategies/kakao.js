import { Strategy as KakaoStrategy } from "passport-kakao";
import { User } from "../../db";

const config = {
  clientID: process.env.kakao_clientID,
  clientSecret: process.env.kakao_clientPassword,
  callbackURL: "/auth/kakao/callback",
};

async function findOrCreateUser({ name, email }) {
  const user = await User.findOne(email);

  if (user) {
    return user;
  }

  const created = await User.create({
    name,
    email,
    password: "KAKAO_OAUTH",
    address: "추가 기입 사항",
    phone: "010-0000-0000",
  });

  return created;
}

const kakao = new KakaoStrategy(config, async (accessToken, refreshToken, profile, done) => {
  const { email, name } = profile._json;
  console.log(profile._json);

  try {
    const user = await findOrCreateUser({ email, name });
    done(null, {
      shortId: user.shortId,
      email: user.email,
      name: user.name,
    });
  } catch (e) {
    done(e, null);
  }
});

export default kakao;
