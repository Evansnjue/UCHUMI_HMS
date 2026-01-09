// File: frontend/src/modules/hr/schemas/employee.schema.ts
import { z } from 'zod';

export const employeeCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date'),
  dateOfBirth: z
    .string()
    .optional()
    .refine((v) => (v === undefined ? true : !isNaN(Date.parse(v))), 'Invalid date')
    .nullable(),
});

export type EmployeeCreateSchema = z.infer<typeof employeeCreateSchema>;
