import Joi from 'joi';

const executionLogSchema = Joi.object({
    cronJobId: Joi.string().required().messages({
        'string.base': 'cronJobId must be a string.',
        'any.required': 'cronJobId is required.'
    }),
    status: Joi.string().valid('SUCCESS', 'FAILURE').required().messages({
        'string.base': 'Status must be a string.',
        'any.only': 'Status must be one of [SUCCESS, FAILURE].',
        'any.required': 'Status is required.',
    }),
    responseStatus: Joi.number().integer().optional(),
    responseBody: Joi.any().optional(),
    error: Joi.any().optional(),
    executedAt: Joi.date().optional()
});

export const validateExecutionLog = executionLogSchema;
