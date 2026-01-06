# Pharmacy Module

Overview
- Provides APIs to list and fulfill prescriptions
- Tracks stock levels in `stock` table
- Records dispenses in `dispensed_drugs` table
- Emits events: `DrugDispensed`, `StockUpdated`

Database
- Add and run migration: `backend/src/pharmacy/migrations/001-create-pharmacy-schema.sql`

Note: This system now uses a centralized inventory (see `backend/src/inventory`) — keep central stock updated and use transfer endpoints to move items between departments.

Key APIs
- GET /pharmacy/prescriptions?status=PENDING — list pending prescriptions (Roles: Pharmacist, Admin)
- GET /pharmacy/prescriptions/:id — get a prescription
- POST /pharmacy/prescriptions/:id/fulfill — fulfill prescription (Roles: Pharmacist, Admin)
  - Body: { items: [{ prescriptionItemId, quantity }] }

Security
- Uses existing JWT + Roles guard already present in the app
- Only `Pharmacist` and `Admin` roles may fulfill prescriptions

Business rules
- Ensures central stock has enough quantity before dispensing
- Enforces per-doctor daily drug limits if configured in `doctor_drug_limit` table

Notes
- Import `PharmacyModule` into your AppModule to activate endpoints:
  - add `PharmacyModule` to `imports` in `AppModule`
- This module expects `Prescription` and `PrescriptionItem` entities to be present in the Clinical module
