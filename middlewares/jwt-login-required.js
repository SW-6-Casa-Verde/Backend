export default function jwtLoginRequired() {
  const blacklist = [];

  // 쿠키 블랙리스트 등록
  async function setBlacklist(req, res, next) {
    const token = req.cookies.token;
    const decode = await verifyJWT(token);
    const localBlackList = req.app.locals.blacklist;

    if (decode.errorMessage || localBlackList.includes(token)) {
      // 바로 돌려보낸다면?
      // return res.status(401).redirect("/");
      const { status, errorMessage } = decode;
      throw { status, message: errorMessage };
    }

    const { role, uuid } = decode;
    req.user = { role, uuid };
    req.token = token;

    next();
  }

  return { blacklist, setBlacklist };
}
