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

  // static async findByUserId({ user_id }) {
  //     const findId = await UserModel.findOne({ user_id });
  // }
}

export default User;
