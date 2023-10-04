import Joi from "joi";

// 전화번호 형식을 정의한 정규 표현식
// const emailPattern = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
const passwordPattern =
  /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W))(?=.*[!@#$%^*+=-]).{8,15}$/;
const phoneNumberPattern = /^\d{3}-\d{3,4}-\d{4}$/;
// const namePattern = /^[a-zA-Z0-9]{2,10}$/;

// Joi 스키마 정의
const userJoiSchema = Joi.object({
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
