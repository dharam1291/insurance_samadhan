import Joi from 'joi';

export const validateFraud = (data: any) => {
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
    fraudType: Joi.string()
      .valid('IDENTITY_THEFT', 'UNAUTHORIZED_TRANSACTION', 'ACCOUNT_TAKEOVER', 'PHISHING', 'OTHER')
      .required()
      .messages({
        'any.only': 'Fraud type must be one of: IDENTITY_THEFT, UNAUTHORIZED_TRANSACTION, ACCOUNT_TAKEOVER, PHISHING, OTHER',
        'any.required': 'Fraud type is required'
      }),
    severity: Joi.string()
      .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
      .default('MEDIUM')
      .messages({
        'any.only': 'Severity must be one of: LOW, MEDIUM, HIGH, CRITICAL'
      }),
    description: Joi.string()
      .trim()
      .max(2000)
      .required()
      .messages({
        'string.max': 'Description cannot exceed 2000 characters',
        'any.required': 'Description is required'
      }),
    evidenceFiles: Joi.array()
      .items(Joi.string().trim())
      .optional(),
    transactionIds: Joi.array()
      .items(Joi.string().trim())
      .optional(),
    amountInvolved: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'Amount involved cannot be negative'
      }),
    currency: Joi.string()
      .max(3)
      .default('USD')
      .optional()
      .messages({
        'string.max': 'Currency code cannot exceed 3 characters'
      }),
    incidentDate: Joi.date()
      .required()
      .messages({
        'any.required': 'Incident date is required'
      })
  });

  return schema.validate(data);
};

export const validateFraudUpdate = (data: any) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid('REPORTED', 'UNDER_INVESTIGATION', 'VERIFIED', 'RESOLVED', 'DISMISSED')
      .optional()
      .messages({
        'any.only': 'Status must be one of: REPORTED, UNDER_INVESTIGATION, VERIFIED, RESOLVED, DISMISSED'
      }),
    severity: Joi.string()
      .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
      .optional()
      .messages({
        'any.only': 'Severity must be one of: LOW, MEDIUM, HIGH, CRITICAL'
      }),
    investigatorId: Joi.string()
      .trim()
      .optional(),
    investigationNotes: Joi.string()
      .trim()
      .max(2000)
      .optional()
      .messages({
        'string.max': 'Investigation notes cannot exceed 2000 characters'
      }),
    resolution: Joi.string()
      .trim()
      .max(1000)
      .optional()
      .messages({
        'string.max': 'Resolution cannot exceed 1000 characters'
      }),
    evidenceFiles: Joi.array()
      .items(Joi.string().trim())
      .optional(),
    transactionIds: Joi.array()
      .items(Joi.string().trim())
      .optional(),
    amountInvolved: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'Amount involved cannot be negative'
      })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  });

  return schema.validate(data);
};