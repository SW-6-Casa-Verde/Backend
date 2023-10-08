import { verifyJWT } from "../utils/jwt";
import { userRole } from "../constants";

export default async function jwtAdminRole(req, res, next) {
  const token = req.cookies.token;
  const { status, errorMessage, role } = await verifyJWT(token);
  console.log(role === userRole.ADMIN, !errorMessage);

  if (!errorMessage && role === userRole.ADMIN) {
    console.log("admin");
    return next(); // next() 이후 코드가 더 있을 때 return 하지 않으면 다음 라우터 실행 후 돌아와서 이후 코드를 실행함. -> 항상 forbidden error 실행
  }

  let error = errorMessage ? { status, message: errorMessage } : { status: 403, message: "Forbidden" };

  console.log("forbidden");
  next(error);
}
