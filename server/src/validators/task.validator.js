const { z } = require('zod');

const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(100, 'Title must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  status: z
    .enum(['TODO', 'IN_PROGRESS', 'DONE'], {
      invalid_type_error: 'Status must be TODO, IN_PROGRESS, or DONE',
    })
    .optional()
    .default('TODO'),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      invalid_type_error: 'Priority must be LOW, MEDIUM, or HIGH',
    })
    .optional()
    .default('MEDIUM'),
  dueDate: z
    .string()
    .datetime({ message: 'Due date must be a valid ISO datetime string' })
    .optional()
    .nullable(),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title must be 100 characters or less')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .nullable(),
  status: z
    .enum(['TODO', 'IN_PROGRESS', 'DONE'], {
      invalid_type_error: 'Status must be TODO, IN_PROGRESS, or DONE',
    })
    .optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      invalid_type_error: 'Priority must be LOW, MEDIUM, or HIGH',
    })
    .optional(),
  dueDate: z
    .string()
    .datetime({ message: 'Due date must be a valid ISO datetime string' })
    .optional()
    .nullable(),
});

module.exports = { createTaskSchema, updateTaskSchema };
