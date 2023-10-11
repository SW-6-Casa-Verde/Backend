import request from "request";
import { User } from "../db";
import { v4 as uuidv4 } from "uuid";
import { userRole } from "../constants"

class AccountService {
  static async socialLogin({ name, email }) {
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

  static async socialNaverLogin(profile, accessToken) {
    const { id, email, name, nickname } = profile;

    const findUser = await User.findByEmail(email);
    // 존재하면 정보 조회 후 갱신
    if (findUser) {
      // 정보 조회 로직 (엑세스 토큰을 가지고 있어야함.)
      // const option = {
      //   url: 'https://openapi.naver.com/v1/nid/me',
      //   headers: {'Authorization': `Bearer ${accessToken}`}
      // };
      // const lookupProfile = await request.get(option)
      // lookupUser(accessToken);

      // 조회된 정보 덮어쓰기 (strategy 추가하기)
      // const saveProfile = await User.updateByUserId({ uuid: id, updateData: lookupProfile });
      // if (!saveProfile) {
      //   console.log("유저 정보 갱신에 실패했습니다.");
      //   return findUser;
      // }
      // return saveProfile;
      console.log("유저 있음")
      return findUser;
    } else {
      // 존재하지 않는다면 회원 가입
      const username = nickname ? nickname : name;
      console.log("유저 없음")
      const newNaverUser = await User.create({
        uuid: id,
        email: email,
        password: "naver-oauth",
        address: "",
        detail_address: "",
        phone: "",
        name: username,
        role: userRole.USER,
        is_sns_user: true
      });

      return !newNaverUser 
        ? { status: 400, message: "유저 등록 실패." }
        : newNaverUser
    }
  }

  static async logout({ token, localBlackList }) {
    if (token) return localBlackList.add(token);
  }
}

export { AccountService };
