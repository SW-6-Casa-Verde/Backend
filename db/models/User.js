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

  static async findByUserId(id) {
    const findUser = await UserModel.findOne({ id });
    return findUser;
  }

  static async updateByUserId({ email, updateData }) {
    // 토큰 구현 이후 email -> id
    const update = { $set: updateData };
    const updateUser = await UserModel.findOneAndUpdate({ email }, update);
    return updateUser;
  }

  static async deleteByUserId(userId) {
    // 토큰 구현 이후 email -> id
    const deleteUser = await UserModel.findOneAndRemove({ email: userId });
    return deleteUser;
  }
}

export default User;
