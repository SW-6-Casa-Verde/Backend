import { Schema } from "mongoose";
import { userRole } from "../../constants";

const { USER, ADMIN } = userRole;

const UserSchema = new Schema({
  // 유저 식별 필드
  uuid: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  name: {
    type: String,
    default: () => `unknown-user`,
  },
  role: {
    type: String,
    enum: [USER, ADMIN],
  },
});

export default UserSchema;
