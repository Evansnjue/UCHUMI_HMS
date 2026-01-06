# Lab Module API

## Endpoints

GET /lab/pending
- Role: LabTechnician
- Returns pending lab requests for lab technicians to process

POST /lab/results
- Role: LabTechnician
- Body: { labRequestId, testId, value, units? }
- Response: created lab result
- Emits: `LabResultUpdated` and `LabCompleted`

GET /lab/request/:id/results
- Roles: LabTechnician, Doctor, Admin
- Returns results for a given lab request

## Events
- `LabCompleted` — published when lab request is completed (after result entered)
  - Payload: { labRequestId, at }
- `LabResultUpdated` — published whenever a lab result is created/updated
  - Payload: { labResultId, at }

## Business rules
- Only users with `LabTechnician` role may enter or modify lab results.
- Lab results are linked to `lab_requests` created by Clinical module.

## Notes
- Extend `listPendingForDepartment` in `LabService` to filter by department or test type.
- For auditability, store `enteredBy` and keep result version history (AMENDED status).
