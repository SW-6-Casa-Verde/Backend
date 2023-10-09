import Joi from "joi";

const itemCreateJoi = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  main_images: Joi.array().required(),
  images: Joi.array(),
});

const itemJoi = Joi.object({
  name: Joi.string().required(),
  price: Joi.number(),
  description: Joi.string(),
  main_images: Joi.array(),
  images: Joi.array(),
});

async function validateCreateItem(data) {
  return itemCreateJoi.validate(data);
}

async function validateItem(data) {
  return itemJoi.validate(data);
}

export { validateCreateItem, validateItem };
