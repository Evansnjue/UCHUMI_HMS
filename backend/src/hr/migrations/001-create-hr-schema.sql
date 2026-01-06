-- backend/src/hr/migrations/001-create-hr-schema.sql

CREATE TABLE hr_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_no varchar(20) NOT NULL UNIQUE,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  phone varchar(32),
  role varchar(50) NOT NULL,
  department varchar(100),
  hire_date date NOT NULL,
  salary numeric(12,2) NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_hr_employees_employee_no ON hr_employees(employee_no);
CREATE INDEX idx_hr_employees_email ON hr_employees(email);

CREATE TABLE hr_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  check_in timestamptz NOT NULL,
  check_out timestamptz,
  shift_date date NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'PRESENT',
  overtime_seconds int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_hr_attendance_employee_shift ON hr_attendance(employee_id, shift_date);

CREATE TABLE hr_payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  gross_pay numeric(12,2) NOT NULL,
  deductions numeric(12,2) NOT NULL DEFAULT 0,
  net_pay numeric(12,2) NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_hr_payroll_employee_period ON hr_payroll(employee_id, period_start, period_end);
