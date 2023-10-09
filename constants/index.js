import urlSafeBase64 from "../utils/urlSafeBase64";

const userRole = {
  USER: "USER",
  ADMIN: "ADMIN",
};
const JWT_SECRET_KEY = urlSafeBase64(process.env.JWT_KEY);

const orderStatusEnum = [
  "ORDER_CONFIRMED",
  "PREPARING_FOR_SHIPMENT",
  "SHIPPED",
  "DELIVERED",
];

const payMethodEnum = ["CARD", "BANK_TRANSFER"];

export { userRole, JWT_SECRET_KEY, orderStatusEnum, payMethodEnum };
