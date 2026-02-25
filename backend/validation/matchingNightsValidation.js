const Joi = require("joi");

const matchingNightsSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  week: Joi.number().min(1).max(15).required().messages({
    "number.base": "Woche muss eine Zahl sein",
    "number.min": "Woche kann nicht unter 1 sein",
    "number.max": "Woche kann maximal 15 sein",
    "any.required": "Woche ist ein Pflichfeld",
  }),
  beams: Joi.number().min(0).max(10).required().messages({
    "number.base": "Beams muss eine Zahl sein",
    "number.min": "Beams kann nicht negativ sein",
    "number.max": "Beams kann maximal 10 sein",
    "any.required": "Beams ist ein Pflichfeld",
  }),
});

module.exports = { matchingNightsSchema };
