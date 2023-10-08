import { verifyJWT } from "../utils/jwt";
import { userRole } from "../constants";

export default async function jwtAdminRole(req, res, next) {
  const token = req.cookies.token;
  const { status, errorMessage, role } = await verifyJWT(token);

  if(!errorMessage && role === userRole.ADMIN) {
    next()
  }

  let error = errorMessage 
    ? { status, message: errorMessage } 
    : { status: 403, message: "Forbidden" }

  next (error);
}
