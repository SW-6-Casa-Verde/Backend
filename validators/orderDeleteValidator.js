import Joi from "joi";

// Joi 스키마 정의
const orderDeleteJoiSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
// hex문자열에 16진수 문자만 포함되어 있는지 확인하고 정확히 length24자로 구성된 문자열인지 확인

async function validateOrderDelete(data) {
  return orderDeleteJoiSchema.validate(data);
}

export { validateOrderDelete };
