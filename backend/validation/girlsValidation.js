const Joi = require("joi");

const createGirlsSchema = Joi.object({
  name: Joi.string().min(2).max(15).required().messages({
    "string.base": "Name muss ein Text sein",
    "string.min": "Name muss mindestens 2 Zeichen lang sein",
    "string.max": "Name darf maximal 15 Zeichen lang sein",
    "any.required": "Name ist ein Pflichtfeld",
  }),
  age: Joi.number().integer().min(18).max(99).required().messages({
    "number.base": "Alter muss eine Zahl sein",
    "number.min": "Alter darf nicht unter 18 liegen",
    "number.max": "Alter darf nicht über 99 liegen",
    "any.required": "Alter ist ein Pflichtfeld",
  }),
});

module.exports = { createGirlsSchema };
