import jwt from "jsonwebtoken";
import urlSafeBase64 from "./urlSafeBase64";
import dotenv from "dotenv";
import { v4 as token_id } from "uuid";
dotenv.config();

const JWT_SECRET_KEY = urlSafeBase64(process.env.JWT_KEY);
const option = {
  expiresIn: '6h',
  algorithm: "HS256",
};

// JWT 생성
async function createJWT(payload) {
  payload.jti = token_id();
  return jwt.sign(payload, JWT_SECRET_KEY, option);
}

// JWT 검증
async function verifyJWT(token) {
  return jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
    if (error) {
      return { status: 401, errorMessage: "토큰 인증이 만료되었습니다." };
    } else return decoded;
  });
}

export { createJWT, verifyJWT };
