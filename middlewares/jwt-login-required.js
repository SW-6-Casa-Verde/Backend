import { verifyJWT } from "../utils/jwt";

export default function jwtLoginRequired() {
  const blacklist = new Set();

  // 쿠키 블랙리스트 등록
  async function setBlacklist(req, res, next) {
    const token = req.cookies.token;
    const decode = await verifyJWT(token);
    const localBlackList = req.app.locals.blacklist;

    if (decode.errorMessage || localBlackList.has(token)) {
      // 바로 돌려보낸다면?
      // return res.status(401).redirect("/");
      localBlackList.add(token);
      const { status, errorMessage } = decode;
      next({ status, message: errorMessage });
    }

    const { role, uuid } = decode;
    req.user = { role, uuid };
    req.token = token;

    next();
  }

  return { blacklist, setBlacklist };
}
