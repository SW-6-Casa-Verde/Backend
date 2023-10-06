import Joi from "joi";

const passwordPattern =
  /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W))(?=.*[!@#$%^*+=-]).{8,15}$/;
const phoneNumberPattern = /^\d{3}-\d{3,4}-\d{4}$/;

// Joi 스키마 정의
const orderJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().regex(passwordPattern).required(),
  address: Joi.string().required(),
  phone: Joi.string().regex(phoneNumberPattern).required(),
  name: Joi.string().max(8).allow(""),
});

async function validateUser(user) {
  if (user.name == "undefined" || user.name == "null") user.name = "";
  return userJoiSchema.validate(user);
}

export default validateUser;
