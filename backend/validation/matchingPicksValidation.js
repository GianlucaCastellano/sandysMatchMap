const Joi = require("joi");

const matchingPicksValidation = Joi.object({
  id: Joi.string().uuid().optional(),
  matchingNightsId: Joi.string().uuid().required().messages({
    "string.guid": "MatchingNightsId muss eine gültige UUID sein",
    "any.required": "MatchingNightsId ist erforderlich",
  }),

  girlId: Joi.string().uuid().required().messages({
    "string.guid": "girlId muss eine gültie UUID sein",
    "any.required": "girlId ist erforderlich",
  }),

  boyID: Joi.string().uuid().required().messages({
    "string.guid": "boyId muss eine gültige UUID sein",
    "any.required": "boyId ist erforderlich",
  }),
});
