import Joi from "joi";

export const tgIdValidator = Joi.object({
    id: Joi
        .number()
        .integer()
        .positive()
        .required()
        .min(11111111)
        .max(9999999999)
});
