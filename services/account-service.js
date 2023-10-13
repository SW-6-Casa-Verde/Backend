import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { userRole } from "../constants"
import { User } from "../db";

class AccountService {
  static async login({ email, password }) {
    const message = "로그인에 실패하였습니다.";

    const user = await User.findByEmail(email);

    if (!user || user.uuid === "guest_id") {
      return { status: 401, message };
    }

    if (user) return user;

    return await User.create({
      uuid: uuidv4(),
      name: "",
      email,
      password: "KAKAO_OAUTH",
      role: userRole.USER,
      is_sns_user: true,
    });
  }

  static async localLogin(user) {
    const { email, password } = user;
    const errorMessage = "로그인에 실패하였습니다.";

    const isEmailMatch = await User.findByEmail(email);
    if (!isEmailMatch || isEmailMatch?.uuid === "guest_id") {
      return { status: 401, message: errorMessage };
    }

    const isPasswordMatch = bcrypt.compareSync(password, isEmailMatch.password);
    if (!isPasswordMatch) {
      return { status: 401, message: errorMessage };
    }

    const { uuid, role } = isEmailMatch;
    return { uuid, role };
  }

  static async socialNaverLogin(profile) {
    const { id, email, name, nickname } = profile;

    const findUser = await User.findByEmail(email);

    // 존재하면 정보 조회 후 갱신
    if (findUser) return findUser; 

    // 존재하지 않는다면 회원 가입
    const username = nickname ? nickname : name;
    const newNaverUser = await User.create({
      uuid: id,
      email: email,
      password: "naver-oauth",
      name: username,
      role: userRole.USER,
      is_sns_user: true
    });

    return !newNaverUser 
      ? { status: 400, message: "유저 등록 실패." }
      : newNaverUser
  }

  static async logout({ token, localBlackList }) {
    if (token) return localBlackList.add(token.jti);
  }
}

export { AccountService };
