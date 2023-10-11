import jwt from "jsonwebtoken";
import urlSafeBase64 from "./urlSafeBase64";

const JWT_SECRET_KEY = urlSafeBase64(process.env.JWT_KEY);
const option = {
  expiresIn: "12h",
  algorithm: "HS256",
};

// JWT 생성
async function createJWT(payload) {
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
