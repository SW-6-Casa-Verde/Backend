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
    const message = "로그인에 실패하였습니다.";

    const user = await User.findByEmail(email);
    console.log(user);
    if (!user || user.uuid === "guest_id") {
      console.log("?");
      return { status: 401, message };
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      return { status: 401, message };
    }

    const { uuid, role } = user;

    return { uuid, role };
  }

  static async logout({ token, localBlackList }) {
    if (token) return localBlackList.add(token);
  }
}
export { AccountService };
