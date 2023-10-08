import Joi from "joi";

const categoryCreateJoi = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
});

const categoryJoi = Joi.object({
  id: Joi.number().required(),
  name: Joi.string(),
});

async function validateCreateCategory(email) {
  return categoryCreateJoi.validate(email);
}

async function validateCategory(email) {
  return categoryJoi.validate(email);
}

export { validateCreateCategory, validateCategory };
