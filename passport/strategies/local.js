import { Strategy as LocalStrategy } from "passport-local";
import { AccountService } from "../../services";
import { validateLogin } from "../../validators";

const config = {
  usernameField: "email",
  passwordField: "password",
};

const local = new LocalStrategy(config, async (email, password, done) => {
  try {
    const { error, value } = await validateLogin({ email, password });
    if (error) throw { status: 400, message: "요청한 값을 다시 확인해주세요." };

    const localUser = await AccountService.localLogin(value);
    if (localUser.message) {
        const { status, message } = localUser;
        throw { status, message };
    }
    // req.user로 정보가 들어감 (이름이 user인 이름은 passport 규칙)
    done(null, localUser);
  } catch (error) {
    done(error, null);
  }
});

export default local;