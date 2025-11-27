const Joi = require("joi");

const createBoySchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "Name muss ein Text sein",
    "string.min": "Name muss mindestens 2 Zeichen lang sein.",
    "string.max": "Name darf maximal 50 Zeichen lang sein",
    "any.required": "Name ist ein Pflichtfeld",
  }),
  age: Joi.number().integer().min(18).max(99).required().messages({
    "number.base": "Alter muss eine Zahl sein",
    "number.min": "Alter darf nicht unter 18 liegen",
    "number.max": "Alter darf nicht unter 99 liegen",
    "any.required": "Alter ist ein Pflichtfeld",
  }),
});

module.exports = { createBoySchema };
