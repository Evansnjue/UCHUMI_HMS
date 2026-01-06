Reporting Frontend components

- `ReportingDashboard` - shows recent reports and a simple revenue line chart
- `ReportViewer` - displays KPIs and offers an export button (server export endpoint to be implemented)
- `api.ts` - API client for templates and reports

Security note: full reports are only visible if the backend returns the full payload (Admin/HR). UI should hide export and full filters for other roles.
