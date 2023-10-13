import Joi from "joi";
import { orderStatusEnum, payMethodEnum } from "../constants";

// Joi 스키마 정의
const orderJoiSchema = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        quantity: Joi.number().min(1).required(),
        unit_price: Joi.number().required(),
        item_id: Joi.string().required(),
        item_name: Joi.string().required(),
      })
    )
    .required(),
  total_price: Joi.number().required(),
  name: Joi.string().required(),
  email: Joi.string().trim().min(10).max(30).email().required(),
  address: Joi.string().required(),
  detail_address: Joi.string(),
  phone: Joi.string().required(),
  request: Joi.string(),
  pay_method: Joi.string()
    .valid(...payMethodEnum)
    .required(),
  order_status: Joi.string()
    .valid(...orderStatusEnum)
    .required(),
});
// hex문자열에 16진수 문자만 포함되어 있는지 확인하고 정확히 length24자로 구성된 문자열인지 확인

const nonMemberOrderJoiSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string().required(),
});

async function validateOrder(data) {
  return orderJoiSchema.validate(data);
}

async function validateNonMemberOrder(data) {
  return nonMemberOrderJoiSchema.validate(data);
}

export { validateOrder, validateNonMemberOrder };
