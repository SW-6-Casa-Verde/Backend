import Joi from "joi";

const categoryCreateJoi = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
});

const categoryJoi = Joi.object({
  id: Joi.number().required(),
  name: Joi.string(),
});

async function validateCreateCategory(data) {
  return categoryCreateJoi.validate(data);
}

async function validateCategory(data) {
  return categoryJoi.validate(data);
}

export { validateCreateCategory, validateCategory };
