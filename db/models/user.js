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

  static async updateByUserId({ uuid, updateData }) {
    const update = { $set: updateData };
    return await UserModel.findOneAndUpdate({ uuid }, update);
  }

  static async deleteByUserId(uuid) {
    return await UserModel.findOneAndRemove({ uuid });
  }
}

export { User, UserModel };
