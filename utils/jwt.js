import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants";

const secretKey = JWT_SECRET_KEY || "jwt-secret-key";
const expires = "10m";

// JWT 생성
function createJWT(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: expires });
}

// JWT 검증
async function verifyJWT(token) {
  return jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return { status: 401, errorMessage: "토큰 인증이 만료되었습니다." };
    } else return decoded;
  });
}

export { createJWT, verifyJWT };
