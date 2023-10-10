import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { UserModel } from "../../db";
import { v4 as uuidv4 } from "uuid";
import { userRole } from "../../constants";

const config = {
  clientID: process.env.kakao_clientID,
  callbackURL: "/auth/kakao/callback",
};

async function findOrCreateUser({ name, email }) {
  const user = await UserModel.findOne({ email: email });

  if (user) user;

  return await UserModel.create({
    uuid: uuidv4(),
    name,
    email,
    password: "KAKAO_OAUTH",
    address: "추가 기입 사항",
    phone: "010-0000-0000",
    role: userRole.USER,
  });
}

const kakao = new KakaoStrategy(config, async (accessToken, refreshToken, profile, done) => {
  const name = profile.displayName;
  const email = profile._json.kakao_account.email;

  try {
    const user = await findOrCreateUser({ name, email });
    done(null, {
      uuid: user.uuid,
      role: user.role,
    });
  } catch (e) {
    done(e, null);
  }
});

export default kakao;
