import Joi from 'joi';

export const validateComplaint = (data: any) => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be a valid international format',
        'any.required': 'Phone number is required'
      }),
    customerName: Joi.string()
      .trim()
      .max(100)
      .required()
      .messages({
        'string.max': 'Customer name cannot exceed 100 characters',
        'any.required': 'Customer name is required'
      }),
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .optional()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    category: Joi.string()
      .valid('SERVICE', 'BILLING', 'TECHNICAL', 'PRODUCT', 'OTHER')
      .required()
      .messages({
        'any.only': 'Category must be one of: SERVICE, BILLING, TECHNICAL, PRODUCT, OTHER',
        'any.required': 'Category is required'
      }),
    priority: Joi.string()
      .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
      .default('MEDIUM')
      .messages({
        'any.only': 'Priority must be one of: LOW, MEDIUM, HIGH, CRITICAL'
      }),
    subject: Joi.string()
      .trim()
      .max(200)
      .required()
      .messages({
        'string.max': 'Subject cannot exceed 200 characters',
        'any.required': 'Subject is required'
      }),
    description: Joi.string()
      .trim()
      .max(2000)
      .required()
      .messages({
        'string.max': 'Description cannot exceed 2000 characters',
        'any.required': 'Description is required'
      }),
    attachments: Joi.array()
      .items(Joi.string().trim())
      .optional(),
    assignedTo: Joi.string()
      .trim()
      .optional()
  });

  return schema.validate(data);
};

export const validateComplaintUpdate = (data: any) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED')
      .optional()
      .messages({
        'any.only': 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED'
      }),
    priority: Joi.string()
      .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
      .optional()
      .messages({
        'any.only': 'Priority must be one of: LOW, MEDIUM, HIGH, CRITICAL'
      }),
    assignedTo: Joi.string()
      .trim()
      .optional(),
    resolution: Joi.string()
      .trim()
      .max(1000)
      .optional()
      .messages({
        'string.max': 'Resolution cannot exceed 1000 characters'
      }),
    attachments: Joi.array()
      .items(Joi.string().trim())
      .optional()
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  });

  return schema.validate(data);
};