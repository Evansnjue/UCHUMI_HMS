Reporting & Analytics Module
============================

Purpose: Generate scheduled or on-demand reports and KPI visualizations for departments across the HMS.

Key files:
- migrations/001-create-reporting-schema.sql — DB migration for templates & reports
- entities/* — TypeORM entities for templates and reports
- dto/* — DTOs for template creation and report generation
- reporting.service.ts — compute KPIs, generate reports, emit events
- reporting.controller.ts — REST API endpoints (template CRUD, generate, list, fetch)
- subscribers/reporting.subscriber.ts — listens to ReportGenerated events for exports/notifications

Notes & best practices:
- Heavy KPI computation should be run as background jobs (Bull + Redis) in production. The service includes computeKpisForTemplate() as an example and simple stubs for visits/payments/stock movements.
- Access control: only Admin and HR are allowed to create templates and generate reports (full view). Other roles can fetch reports but receive a sanitized view as enforced in the service.
- Add materialized views or incremental aggregates for high-volume KPIs to improve performance.
