import { verifyJWT } from "../utils/jwt";

export default function jwtLoginRequired() {
  const blacklist = new Set();

  // 쿠키 블랙리스트 등록
  async function setBlacklist(req, res, next) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return next({ status: 401, message: "인증되지 않은 사용자" });
    }

    const decode = await verifyJWT(token);
    const localBlackList = req.app.locals.blacklist;
    if (localBlackList.has(decode?.jti)) {
      return next({ status: 401, message: "Token revoked" });
    }

    if (decode.errorMessage) {
      const { status, errorMessage } = decode;
      return next({ status, message: errorMessage });
    }

    const { role, uuid, jti } = decode;
    req.user = { role, uuid, jti };

    next();
  }

  return { blacklist, setBlacklist };
}
