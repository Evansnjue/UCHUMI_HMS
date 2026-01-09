/**
 * Zod schemas for Clinical forms
 */
import { z } from 'zod';
import { DrugCategory } from '../types/clinical.dto';

export const consultationNoteSchema = z.object({
  patientId: z.string().uuid({ message: 'Invalid patient id' }),
  clinicianId: z.string().uuid({ message: 'Invalid clinician id' }),
  clinicianRole: z.enum(['DOCTOR', 'NURSE', 'ADMIN']),
  visitId: z.string().uuid().optional().nullable(),
  note: z.string().min(5, { message: 'Note is too short' }).max(5000, { message: 'Note is too long' }),
});

export const diagnosisSchema = z.object({
  consultationId: z.string().uuid({ message: 'Invalid consultation id' }),
  clinicianId: z.string().uuid({ message: 'Invalid clinician id' }),
  icd10Code: z.string().max(16).optional().nullable(),
  description: z.string().min(3, { message: 'Description is too short' }).max(2000),
});

export const prescriptionLineSchema = z.object({
  drugId: z.string().uuid({ message: 'Invalid drug id' }),
  drugName: z.string().min(1).max(300),
  drugCategory: z.nativeEnum(DrugCategory),
  dose: z.string().min(1).max(100),
  frequency: z.string().min(1).max(100),
  durationDays: z.number().int().positive().max(365),
  instructions: z.string().max(1000).optional(),
});

export const prescriptionSchema = z.object({
  patientId: z.string().uuid({ message: 'Invalid patient id' }),
  clinicianId: z.string().uuid({ message: 'Invalid clinician id' }),
  lines: z.array(prescriptionLineSchema).min(1, { message: 'At least one prescription line is required' }),
});

export const labTestSchema = z.object({
  code: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
});

export const labRequestSchema = z.object({
  patientId: z.string().uuid({ message: 'Invalid patient id' }),
  clinicianId: z.string().uuid({ message: 'Invalid clinician id' }),
  tests: z.array(labTestSchema).min(1, { message: 'At least one test is required' }),
  priority: z.enum(['ROUTINE', 'STAT']).default('ROUTINE'),
  notes: z.string().max(2000).optional(),
});

export const uuidParamSchema = z.object({ id: z.string().uuid() });

export type ConsultationNoteForm = z.infer<typeof consultationNoteSchema>;
export type DiagnosisForm = z.infer<typeof diagnosisSchema>;
export type PrescriptionForm = z.infer<typeof prescriptionSchema>;
export type PrescriptionLineForm = z.infer<typeof prescriptionLineSchema>;
export type LabRequestForm = z.infer<typeof labRequestSchema>;
