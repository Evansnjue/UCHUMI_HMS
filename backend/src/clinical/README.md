# Clinical / Dental / Optical Module

This module supports consultations, prescriptions (with daily category limits), and lab requests.

Key concerns:
- Doctors create consultations and issue prescriptions and lab requests
- Prescriptions enforce per-doctor daily limits per drug category
- Events: `PrescriptionIssued`, `LabRequested` are emitted for downstream systems

Migrations: `src/clinical/migrations/001-create-clinical-schema.sql`
APIs: See `src/clinical/API.md`
