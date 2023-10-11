import bcrypt from "bcrypt";
import { createJWT } from "../utils/jwt";
import { User } from "../db";

class AccountService {
  static async googleLogin(user) {
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
}
export { AccountService };
