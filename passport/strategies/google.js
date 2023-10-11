import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../../db";
import { UserService } from "../../services/user-service";
import { userRole } from "../../constants";

const config = {
  clientID: process.env.google_clientID,
  clientSecret: process.env.google_clientPassword,
  callbackURL: "/api/auth/google/callback",
};

async function findOrCreateUser({ name, email }) {
  const user = await User.findByEmail(email);

  if (user) {
    return user;
  }

  const created = await UserService.addUser({
    name,
    email,
    password: "GOOGLE_OAUTH",
    is_sns_user: true,
  });
  //user service의 addUser를 사용하는 게 더 좋을 것 같은데 그러면 address phone은 required 풀어야 될 듯
  //회원 탈퇴하려면 db에 access token 저장해둬야 함... 스키마 필요

  return created;
}

export default new GoogleStrategy(config, async (accessToken, refreshToken, profile, done) => {
  const { email, name } = profile._json;
  console.log(profile);

  try {
    const user = await findOrCreateUser({ email, name });
    console.log(user);
    done(null, {
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (e) {
    done(e, null);
  }
});
