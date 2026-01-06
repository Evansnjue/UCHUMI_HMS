# Clinical Module API

## Endpoints

POST /clinical/consultations
- Role: Doctor
- Request: { patientId, diagnosis, notes? }
- Response: created consultation

POST /clinical/prescriptions
- Role: Doctor
- Request: { consultationId, items: [{ drugId, quantity, instructions? }] }
- Behavior: enforces per-doctor daily drug category limits
- Response: created prescription

POST /clinical/lab-requests
- Role: Doctor
- Request: { consultationId, testName, notes? }
- Response: created lab request

GET /clinical/patient/:id/consultations
- Roles: Doctor, Receptionist, Admin
- Response: consultations for patient

## Events
- `PrescriptionIssued` — emitted after successful prescription
  - Payload: { prescriptionId, at }
- `LabRequested` — emitted after successful lab request
  - Payload: { labRequestId, at }

## Business rules
- Each doctor is limited to predefined daily drug category limits. If a prescription would cause the doctor to exceed a category's daily limit, the request is rejected.
- Prescriptions include `quantity` per item; limits are applied to summed quantities per category per doctor per day.

