import { model } from "mongoose";
import UserSchema from "../schemas/user";

const UserModel = model("User", UserSchema);

class User {
  static async findByEmail(email) {
    const findEmail = await UserModel.findOne({ email });
    return findEmail;
  }

  static async create(user) {
    const newUser = await UserModel.create(user);
    return newUser;
  }

  //order에서 사용자 받아오기
  static async findByUserId(user_id) {
    return await UserModel.findOne({ user_id });
  }
}

export default User;
