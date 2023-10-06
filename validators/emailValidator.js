import Joi from "joi";

const emailJoiSchema = Joi.object({
  email: Joi.string().required().max(30).email().trim(),
});

// 로그인 요청 검증 미들웨어
async function validateEmail(email) {
  return emailJoiSchema.validate(email);
}

export default validateEmail;
