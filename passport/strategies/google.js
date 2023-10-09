import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../../db";
import { createJWT } from "../../utils/jwt";

const config = {
  clientID: process.env.google_clientID,
  clientSecret: process.env.google_clientPassword,
  callbackURL: "/auth/google/callback",
};

async function findOrCreateUser({ name, email }) {
  const user = await User.findByEmail(email);

  if (user) {
    return user;
  }

  const created = await User.create({
    name,
    email,
    password: "GOOGLE_OAUTH",
    address: ".",
    phone: ".",
  });
  //user service의 addUser를 사용하는 게 더 좋을 것 같은데 그러면 address phone은 required 풀어야 될 듯

  return created;
}

export default new GoogleStrategy(config, async (accessToken, refreshToken, profile, done) => {
  const { email, name } = profile._json;
  console.log(profile);

  try {
    const user = await findOrCreateUser({ email, name });
    done(null, {
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (e) {
    done(e, null);
  }
});
