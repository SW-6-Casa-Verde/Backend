import User from "../db/models/User";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { userRole } from "../constants";

class UserService {
  static async checkEmailDuplicate(email) {
    const isEmailUnique = await User.findByEmail(email);
    if (isEmailUnique) {
      const errorMessage = "중복된 이메일 주소입니다.";
      return { errorMessage };
    }
    return isEmailUnique;
  }

  static async addUser(newUser) {
    const { email, password } = newUser;
    // 이메일 중복 검증 (더블 체크)
    const isEmailUnique = await this.checkEmailDuplicate(email);
    if (isEmailUnique) {
      const errorMessage = isEmailUnique.errorMessage;
      return { status: 409, errorMessage };
    }

    // role 검증
    // 클라이언트에서 받아올 값은 아니지만 잘못된 값 처리를 위한 로직
    if (typeof newUser.role !== "undefined") {
      return { status: 403, errorMessage: "Invalid User Role." };
    }

    // 비밀번호 해쉬
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuid();
    let { address, phone, name } = newUser;
    name = !name ? undefined : name;

    const validatedUser = {
      id,
      email,
      password: hashedPassword,
      address,
      phone,
      name,
      role: "USER",
    };
    const createNewUser = await User.create(validatedUser);
    // createNewUser error check
    if (!createNewUser) {
      const errorMessage = "회원가입에 실패하였습니다.";
      return { status: 409, errorMessage };
    }
    // success
    return createNewUser;
  }

  static async getUserInfo(userId) {
    const getUser = await User.findByUserId(userId);
    if (!getUser) {
      const errorMessage = "사용자 조회에 실패하였습니다.";
      return { status: 400, errorMessage };
    }
    const { email, address, phone, name } = getUser;
    const resData = { email, address, phone, name };
    return resData;
  }

  // 토큰 구현 이후 email -> id
  static async setUserInfo({ email, value }) {
    if ("role" in value && value.role !== "USER") {
      delete value.role;
    }

    if ("password" in value) {
      const isPassword = await bcrypt.hash(value.password, 10);
      value.password = isPassword;
    }

    const updatedUserInfo = await User.updateByUserId({
      email,
      updateData: value,
    });
    if (!updatedUserInfo) {
      const errorMessage = "사용자 정보 수정에 실패하였습니다.";
      return { status: 400, errorMessage };
    }
    return updatedUserInfo;
  }

  static async deleteUser(userId) {
    const delUser = await User.deleteByUserId(userId);
    if (!delUser) {
      const errorMessage = "사용자 삭제에 실패하였습니다.";
      return { status: 400, errorMessage };
    }
    return delUser;
  }
}

export default UserService;
