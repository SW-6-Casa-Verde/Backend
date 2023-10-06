export default function jwtBlacklist() {
  const blacklist = [];

  // 쿠키 블랙리스트 등록
  function setBlacklist(req, res, next) {
    const token = req.cookies.token;
    const localBlackList = req.app.locals.blacklist;
    if (!token || localBlackList.includes(token)) {
      return res.status(401).redirect("/");
    }

    req.token = token;

    next();
  }

  return { blacklist, setBlacklist };
}