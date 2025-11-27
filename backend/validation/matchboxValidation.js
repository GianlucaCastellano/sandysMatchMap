const Joi = require("joi");

const matchboxSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  boyId: Joi.string().uuid().required().messages({
    "string.guid": "boyId muss eine gültige UUID sein",
    "any.required": "boyId ist erforderlich",
  }),

  girlId: Joi.string().uuid().required().messages({
    "string.guid": "girlId muss eine gültige UUID sein",
    "any.required": "girlId ist erforderlich",
  }),

  result: Joi.boolean()
});
