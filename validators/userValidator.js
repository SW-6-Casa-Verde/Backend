import Joi from "joi";

const passwordPattern =
  /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W))(?=.*[!@#$%^*+=-]).{8,15}$/;
const phoneNumberPattern = /^\d{3}-\d{3,4}-\d{4}$/;

// Joi 스키마 정의
const userJoiSchema = Joi.object({
  email: Joi.string().min(10).max(30).email().required().trim(),
  password: Joi.string()
    .min(8)
    .max(30)
    .regex(passwordPattern)
    .required()
    .trim(),
  address: Joi.string().required(),
  phone: Joi.string().regex(phoneNumberPattern).required(),
  name: Joi.string().max(8).allow(""),
});

async function validateUser(user) {
  if (user.name == "undefined" || user.name == "null") user.name = "";
  return userJoiSchema.validate(user);
}

export default validateUser;
