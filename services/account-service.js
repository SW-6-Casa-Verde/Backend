import bcrypt from "bcrypt";
import { createJWT } from "../utils/jwt";
import { User } from "../db";

class AccountService {
  static async localLogin(user) {
    const { email, password } = user;
    const errorJson = { status: 401, message: "로그인에 실패하였습니다." };

    const isEmailMatch = await User.findByEmail(email);
    if (!isEmailMatch) return errorJson;

    const isPasswordMatch = bcrypt.compareSync(password, isEmailMatch.password);
    if (!isPasswordMatch) return errorJson;

    const { uuid, email: userEmail, role, name } = isEmailMatch;
    const userInfo = {
      uuid, 
      email: userEmail,
      role, 
      name,
    };

    return userInfo;
  }

  static async socialLogin() {
    
  }

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

    const { uuid, role } = isEmailMatch
    const token = createJWT({ uuid, role });

    return { token };
  }

  static async logout({ token, localBlackList }) {
    if (token) return localBlackList.add(token);
  }
}

export { AccountService };
