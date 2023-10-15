import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
import { User } from "./models/user";
import { userRole } from "../constants";

mongoose.connect(`${process.env.DATABASE_URL}/CasaVerde`);

mongoose.connection.on("error", () => {
  console.error.bind(console, "MongoDB connect error:");
});
mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected");
});

async function boot() {
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  // 관리자 유저 기본 데이터
  const adminCheck = await User.findByUserId("admin_id");
  if (!adminCheck) {
    await User.create({
      uuid: "admin_id",
      email: "admin@admin.com",
      password: adminPassword,
      address: "서울특별시 구구 동동",
      detail_address: "엘리스빌라 야호",
      phone: "010-0000-0000",
      name: "admin",
      role: userRole.ADMIN,
    });
  }

  // 비회원 유저 기본 데이터
  const guestCheck = await User.findByUserId("guest_id");
  if (!guestCheck) {
    await User.create({
      uuid: "guest_id",
      email: "guest@guest.com",
      password: adminPassword,
      address: "서울특별시 구구 동동",
      detail_address: "엘리스빌라 야호",
      phone: "010-0000-0000",
      name: "guest",
      role: userRole.USER,
    });
  }
}

boot();

export * from "./models/item";
export * from "./models/order";
export * from "./models/user";
export * from "./models/orderItem";
export * from "./models/category";
