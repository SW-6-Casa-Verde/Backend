import bcrypt from "bcrypt";
import { createJWT } from "../utils/jwt";
import { User } from "../db";
import { v4 as uuidv4 } from "uuid";
import { userRole } from "../constants";

class AccountService {
  static async kakaoLogin({ name, email }) {
    const user = await User.findByEmail(email);

    if (user) return user;

    return await User.create({
      uuid: uuidv4(),
      name,
      email,
      password: "KAKAO_OAUTH",
      role: userRole.USER,
      is_sns_user: true,
    });
  }

  static async googleLogin({ email, password }) {
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
    if (token) return localBlackList.add(token);
  }
}
export { AccountService };
