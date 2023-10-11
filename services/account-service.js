import bcrypt from "bcrypt";
import { User } from "../db";

class AccountService {
  static async googleLogin({ email, password }) {
    const errorMessage = "로그인에 실패하였습니다.";

    const user = await User.findByEmail(email);

    if (!user || user.uuid === "guest_id") {
      return { status: 401, errorMessage };
    }

    const isPasswordMatch = await bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      return { status: 401, errorMessage };
    }

    const { uuid, role } = user;
    return { uuid, role };
  }

  static async logout({ token, localBlackList }) {
    if (token) return localBlackList.add(token);
  }
}

export { AccountService };
