const Joi = require("joi");

exports.validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    countInStock: Joi.number().min(0).required(),
  });
  return schema.validate(data);
};
