import Joi from "joi";

// Joi 스키마 정의
const orderJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  name: Joi.string()
    .regex(/^[a-zA-Z0-9-]+$/)
    .default(() => `${randStr(7)}-user`),
});

function validateUser(user) {
  const {} = user;
  return userJoiSchema.validate(user);
}

export default validateUser;
