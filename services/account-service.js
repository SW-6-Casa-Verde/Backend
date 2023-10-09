import bcrypt from "bcrypt";
import { createJWT } from "../utils/jwt";
import { User } from "../db";

class AccountService {
  static async login(user) {
    const { email, password } = user;
    const errorMessage = "로그인에 실패하였습니다.";

    const isEmailMatch = await User.findByEmail(email);
    if (!isEmailMatch || isEmailMatch?.uuid === "guest_id") {
      return { status: 401, errorMessage };
    }

    const isPasswordMatch = bcrypt.compareSync(password, isEmailMatch.password);
    if (!isPasswordMatch) {
      return { status: 401, errorMessage };
    }

    // 추후 세션 구현하면 민감한 정보는 넣지 않도록 하기
    const { uuid, email: username, password: usrpw, address, phone, name, role } = isEmailMatch;
    const usr = { uuid, email: username, password: usrpw, role };
    const token = createJWT(usr);
    const authUserInfo = { uuid, email, address, phone, name };

    return { token, authUserInfo };
  }

  static async logout({ token, localBlackList }) {
    return localBlackList.add(token);
  }
}

export { AccountService };
