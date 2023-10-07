import bcrypt from "bcrypt";
import { createJWT } from "../utils/jwt";
import { User } from "../db";

class LoginService {
  static async loginUser(user) {
    const { email, password } = user;
    const errorMessage = "로그인에 실패하였습니다.";

    const isEmailMatch = await User.findByEmail(email);
    if (!isEmailMatch) {
      return { status: 401, errorMessage };
    }

    const isPasswordMatch = bcrypt.compareSync(password, isEmailMatch.password);
    if (!isPasswordMatch) {
      return { status: 401, errorMessage };
    }

    const { uuid, email: username, password: usrpw, address, phone, name, role } = isEmailMatch;
    const usr = { uuid, email: username, password: usrpw, role };
    const token = createJWT(usr);
    const authUserInfo = { uuid, email, address, phone, name };

    return { token, authUserInfo };
  }
}

export { LoginService };
