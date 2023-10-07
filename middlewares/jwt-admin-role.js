import { verifyJWT } from "../utils/jwt";
import { userRole } from "../constants";

export default async function jwtAdminRole(req, res, next) {
  const token = req.cookies.token;
  const decode = await verifyJWT(token);
  // 토큰 만료 체크
  if (decode.errorMessage) {
    const { status, errorMessage } = decode;
    throw { status, message: errorMessage };
  }

  if (decode.role !== userRole.ADMIN) {
    throw { status: 403, message: "Forbidden" };
  }

  next();
}
