import Joi from 'joi';

const cronJobSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Name must be a string.',
        'any.required': 'Name is required.',
    }),
    cronExpression: Joi.string().required().messages({
        'string.base': 'Cron expression must be a string.',
        'any.required': 'Cron expression is required.',
    }),
    webhookUrl: Joi.string().uri().required().messages({
        'string.base': 'Webhook URL must be a string.',
        'string.uri': 'Webhook URL must be a valid URI.',
        'any.required': 'Webhook URL is required.',
    }),
    isActive: Joi.boolean().default(true).messages({
        'boolean.base': 'isActive must be a boolean.'
    })
});

export const validateCronJob = cronJobSchema;
