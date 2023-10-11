import bcrypt from "bcrypt";
import { User } from "../db";
import { v4 as uuidv4 } from "uuid";
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
    let { address = "", detail_address = "", phone = "", name = undefined, is_sns_user } = newUser;

    const validatedUser = {
      uuid: uuidv4(),
      email,
      password: hashedPassword,
      address,
      detail_address,
      phone,
      name,
      role: userRole.USER,
      is_sns_user,
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

  static async getUserInfo(userUuid) {
    const getUser = await User.findByUserId(userUuid);
    if (!getUser) {
      const errorMessage = "사용자 조회에 실패하였습니다.";
      return { status: 400, errorMessage };
    }
    const { uuid, email, address, detail_address, phone, name } = getUser;
    return { uuid, email, address, detail_address, phone, name };
  }

  static async setUserInfo({ currentUser, clientUuid, value }) {
    const errorMessage = "사용자 정보 수정에 실패하였습니다.";

    if (!(currentUser.role === userRole.ADMIN) && "role" in value && value.role !== "USER") {
      return { status: 400, errorMessage };
    }

    if ("password" in value) {
      const isPassword = await bcrypt.hash(value.password, 10);
      value.password = isPassword;
    }

    const updatedUserInfo = await User.updateByUserId({
      uuid: clientUuid,
      updateData: value,
    });

    if (!updatedUserInfo) {
      return { status: 400, errorMessage };
    }

    return updatedUserInfo;
  }

  static async deleteUser(userUuid) {
    const delUser = await User.deleteByUserId(userUuid);
    if (!delUser) {
      const errorMessage = "사용자 삭제에 실패하였습니다.";
      return { status: 400, errorMessage };
    }
    return delUser;
  }

  static async getNonMemberId() {
    const nonMember = await User.findByUserId("guest_id");
    if (!nonMember) {
      const errorMessage = "비회원 유저가 없습니다.";
      return { status: 404, errorMessage };
    }
    return nonMember._id;
  }
}

export { UserService };
