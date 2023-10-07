import Joi from "joi";

// const emailPattern = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
const passwordPattern = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W))(?=.*[!@#$%^*+=-]).{8,15}$/;
const phoneNumberPattern = /^\d{3}-\d{3,4}-\d{4}$/;
const namePattern = /^[a-zA-Z0-9]{2,12}$/;

// Joi 스키마 정의
const userUpdateJoiSchema = Joi.object({
  password: Joi.string().min(8).max(30).regex(passwordPattern).required().trim(),
  address: Joi.string(),
  phone: Joi.string().regex(phoneNumberPattern),
  name: Joi.string().regex(namePattern),
  role: Joi.string().valid("USER", "ADMIN"),
});

async function validateUserUpdate(user) {
  return userUpdateJoiSchema.validate(user);
}

export { validateUserUpdate };
