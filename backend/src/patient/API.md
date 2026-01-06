# Patient Module API

## Endpoints

POST /patients
- Create a patient record. Supports optional assignment of OPD/IPD numbers and departments.
- **Security**: Requires an authenticated user with one of roles: Receptionist, Doctor, Admin
-Payload example and business rules below.
- Request example:
  {
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "numbers": [{ "type": "OPD", "number": "OPD-12345" }, { "type": "IPD", "number": "IPD-987" }],
    "departments": [{ "departmentCode": "GEN" }]
  }
- Response: created patient resource with `numbers` and `departments` relations.

GET /patients?query=...&department=...
- Search patients by name or number and optionally filter by department code
- **Security**: Requires authenticated user with one of roles: Receptionist, Doctor, Admin

GET /patients/:id
- Retrieve a patient by id including numbers and assigned departments

PATCH /patients/:id
- Update patient details, numbers, and department assignments
- Business rule: Both OPD and IPD numbers may coexist; numbers must be unique globally

## Events
- `PatientRegistered` — { patientId, at }
- `PatientUpdated` — { patientId, at }

## Business rules
- Patient numbers (OPD/IPD) are unique globally (unique index on `patient_numbers.number`)
- Patient may hold both OPD and IPD numbers simultaneously
- Departments must exist before assignment (seeded values in migration)
- On registration and updates, appropriate events are emitted for downstream systems

## Notes
- For concurrency-sensitive numbering (e.g., incrementing clinical numbers), use DB sequences or an atomic counter service (Redis INCR). This example assumes externally-generated unique numbers.
