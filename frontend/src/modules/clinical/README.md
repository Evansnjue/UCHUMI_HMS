Clinical module

This module contains UI, hooks, services, schemas and guards for the Clinical feature.

Quick start

- Use exported pages: `DoctorDashboardPage`, `ConsultationPage`, `PrescriptionReviewPage`.
- Hook examples: `useDashboard(clinicianId)`, `useCreatePrescription()`.
- Components: `ConsultationNoteForm`, `DiagnosisForm`, `PrescriptionForm`, `LabRequestForm`, `DrugLimitsViewer`.

Notes

- Auth integration: components assume an auth provider exposing current clinician id and JWT in localStorage (`access_token`).
- Business rules: UI enforces best-effort drug-limits checks and immutability; backend must be authoritative.
