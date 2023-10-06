import urlSafeBase64 from "../utils/urlSafeBase64";

const userRole = ["USER", "ADMIN"];
const JWT_SECRET_KEY = urlSafeBase64(process.env.JWT_KEY);

export { userRole, JWT_SECRET_KEY };
