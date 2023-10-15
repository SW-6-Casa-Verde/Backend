import Joi from "joi";
import { orderStatusEnum } from "../constants";

// Joi 스키마 정의
const adminOrderUpdateJoiSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  order_status: Joi.string()
    .valid(...orderStatusEnum)
    .required(),
});

const userOrderUpdateJoiSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string(),
  address: Joi.string(),
  detail_address: Joi.string(),
  phone: Joi.string(),
  request: Joi.string(),
});

async function validateAdminOrderUpdate(data) {
  return adminOrderUpdateJoiSchema.validate(data);
}

async function validateUserOrderUpdate(data) {
  return userOrderUpdateJoiSchema.validate(data);
}

export { validateAdminOrderUpdate, validateUserOrderUpdate };
