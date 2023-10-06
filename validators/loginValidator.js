import Joi from "joi";

const disallowedCharsRegex = /^[^'"]*$/;

const loginJoiSchema = Joi.object({
  email: Joi.string().required().min(10).max(30).email().trim(),
  password: Joi.string()
    .required()
    .min(8)
    .max(30)
    .regex(disallowedCharsRegex)
    .trim(),
});

// 로그인 요청 검증 미들웨어
async function validateLogin(login) {
  return loginJoiSchema.validate(login);
}

export default validateLogin;
