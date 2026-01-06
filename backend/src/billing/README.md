# Billing & Finance Module

Overview
- Generate invoices for consultations, labs, and pharmacy items
- Accept payments (CASH, MOBILE_MONEY, INSURANCE)
- Track revenue reports (day, week, month)
- Emits events: `InvoiceGenerated`, `PaymentReceived`

DB
- Run `backend/src/billing/migrations/001-create-billing-schema.sql`

Key APIs
- POST /billing/invoices — create invoice (roles: Admin, Receptionist, Accountant)
  - Body example: { "patientId": "...", "items": [{ "description": "Consultation", "quantity": 1, "unitPrice": 10 }], "insuranceProvider": "InsCo", "insuranceCoveredAmount": 8 }
- GET /billing/invoices/:id — get invoice (roles: Admin, Accountant, Receptionist, Doctor)
- POST /billing/invoices/:id/payments — record payment
  - Body example: { "amount": 2, "method": "CASH", "provider": "", "reference": "" }
- GET /billing/reports/revenue?period=day|week|month — returns total revenue for period

Business rules
- Totals are auto-calculated from billing items
- Insurance coverage reduces patient's responsibility (insuranceCoveredAmount must be provided)
- Payments update invoice status (UNPAID, PARTIAL, PAID)

Notes
- Ensure `BillingModule` is imported in `AppModule` (done by default in this project)
- Hook `PaymentReceived` events to external finance or ledger systems in production
