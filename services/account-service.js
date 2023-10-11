import bcrypt from "bcrypt";
import { createJWT } from "../utils/jwt";
import { User } from "../db";

class AccountService {
  static async googleLogin(user) {
    const { email, password } = user;
    const errorMessage = "로그인에 실패하였습니다.";

    const user = await User.findByEmail(email);
    if (!user || user.uuid === "guest_id") {
      return { status: 401, errorMessage };
    }

    const isPasswordMatch = bcrypt.compareSync(password, isEmailMatch.password);
    if (!isPasswordMatch) {
      return { status: 401, errorMessage };
    }

    const { uuid, role } = user;

    return { uuid, role };
  }

  static async logout({ token, localBlackList }) {
    return localBlackList.add(token);
  }
}

export { AccountService };
