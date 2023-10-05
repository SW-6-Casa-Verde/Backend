import { model } from "mongoose";
import UserSchema from "../schemas/user";

const UserModel = model("User", UserSchema);

class User {
  static async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  static async create(user) {
    return await UserModel.create(user);
  }

  static async findByUserId(uuid) {
    return await UserModel.findOne({ uuid });
  }

  static async updateByUserId({ email, updateData }) {
    // 토큰 구현 이후 email -> uuid
    const update = { $set: updateData };
    return await UserModel.findOneAndUpdate({ email }, update);
  }

  static async deleteByUserId(uuid) {
    // 토큰 구현 이후 email -> uuid
    return await UserModel.findOneAndRemove({ email: uuid });
  }
}

export default User;
