HR Module
=========

Purpose: Manage employee records, attendance, overtime, and payroll.

Files:
- migrations/001-create-hr-schema.sql — DB migration
- entities/* — TypeORM entities
- dto/* — DTOs with validation
- hr.service.ts — business logic (employee creation, check-in/out, payroll)
- hr.controller.ts — REST API endpoints
- hr.events.ts — event payload definitions
- subscribers/hr.subscriber.ts — event subscribers

Notes:
- Use role 'HR' for HR users; endpoints guarded by JwtAuthGuard and RolesGuard.
- Payroll generation is intentionally simple; integrate tax/deductions in future.
- For production, replace in-memory employee-number allocation with a database-backed sequence.
