-- backend/src/reporting/migrations/001-create-reporting-schema.sql

CREATE TABLE reporting_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(200) NOT NULL,
  department varchar(100),
  description text,
  "kpi_definitions" jsonb NOT NULL, -- kpi name -> sql/aggregation definition or function reference
  "default_params" jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reporting_templates_department ON reporting_templates(department);

CREATE TABLE reporting_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES reporting_templates(id) ON DELETE SET NULL,
  name varchar(255),
  department varchar(100),
  period_start date NOT NULL,
  period_end date NOT NULL,
  type varchar(20) NOT NULL, -- DAILY, WEEKLY, MONTHLY
  generated_by uuid,
  generated_at timestamptz NOT NULL DEFAULT now(),
  "payload" jsonb NOT NULL, -- KPI results and metadata
  status varchar(20) NOT NULL DEFAULT 'READY', -- READY, PROCESSING, FAILED
  exported_to varchar(50),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reporting_reports_department_generated ON reporting_reports(department, generated_at);
CREATE INDEX idx_reporting_reports_template_period ON reporting_reports(template_id, period_start, period_end);

-- Consider adding materialized views or aggregated tables later for heavy KPI queries
