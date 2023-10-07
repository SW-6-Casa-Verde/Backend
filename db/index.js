import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { User } from "./models/User";

mongoose.connect(`${process.env.DATABASE_URL}/CasaVerde`);

mongoose.connection.on("error", () => {
  console.error.bind(console, "MongoDB connect error:");
});
mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected");
});

async function boot() {
  // await Category.deleteMany({});
  // console.log('database Category initialized');
  // await Category.insertMany([
  //     { id: 1, name: 'PLANT' },
  //     { id: 2, name: 'POT' },
  //     { id: 3, name: 'GARDENING TOOL' },
  //     { id: 4, name: 'GARDENING KIT' },
  // ])

  // 관리자 유저 기본 데이터
  const adminCheck = await User.findByUserId("admin_id");
  // 관리자 데이터가 없으면 넣음.
  if (!adminCheck) {
    await User.create({
      uuid: "admin_id",
      email: "admin@admin.com",
      password: "adminadmin@",
      address: "서울특별시 구구 동동",
      phone: "010-0000-0000",
      name: "admin",
      role: "ADMIN",
    });
  }
}

boot();
