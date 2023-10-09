const userRole = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const orderStatusEnum = [
  "ORDER_CONFIRMED",
  "PREPARING_FOR_SHIPMENT",
  "SHIPPED",
  "DELIVERED",
];

const payMethodEnum = ["CARD", "BANK_TRANSFER"];

const strategiesEnum = {
  LOCAL: "local",
  JWT: "jwt",
  GOOGLE: "google",
  NAVER: "naver",
  KAKAO: "kakao",
};

export { userRole, orderStatusEnum, payMethodEnum, strategiesEnum };
