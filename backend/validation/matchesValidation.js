const Joi = require("joi");

const matchesSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  boyId: Joi.string().uuid().required().messages({
    "string.guid": "boyId muss eine gültige UUID sein",
    "any.required": "boyId ist erforderlich",
  }),

  girlId: Joi.string().uuid().required().messages({
    "string.guid": "girlId muss eine gültige UUID sein",
    "any.required": "girlId ist erforderlich",
  }),

  isMatch: Joi.boolean().required().messages({
    "boolean.base": "isMatch muss true oder false sein",
    "any.required": "isMatch ist erforderlich",
  }),

  week: Joi.number().integer().min(1).max(15).required().messages({
    "number.base": "Woche muss eine Zahl sein",
    "number.min": "Woche kann nicht unter 1 sein",
    "number.max": "Die maximale Woche ist 15",
    "any.required": "Woche ist ein Pflichtfeld",
  }),
});

module.exports = { matchesSchema };
