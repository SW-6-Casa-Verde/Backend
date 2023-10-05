import Joi from "joi";

const orderStatus = [
  "ORDER_CONFIRMED",
  "PREPARING_FOR_SHIPMENT",
  "SHIPPED",
  "DELIVERED",
];
const payMethod = ["CARD", "BANK_TRANSFER"];

// Joi 스키마 정의
const orderJoiSchema = Joi.object({
  total_price: Joi.number().required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  request: Joi.string(),
  pay_method: Joi.string()
    .valid(...payMethod)
    .required(),
  order_status: Joi.string()
    .valid(...orderStatus)
    .required(),
  user_id: Joi.string().hex().length(24).required(),
});
// hex문자열에 16진수 문자만 포함되어 있는지 확인하고 정확히 length24자로 구성된 문자열인지 확인

async function validateOrder(user) {
  return orderJoiSchema.validate(user);
}

export default validateOrder;
