-- Patient management schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text
);

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  date_of_birth date,
  gender text,
  phone text,
  email text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patient_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('OPD','IPD')),
  number text NOT NULL UNIQUE,
  assigned_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patient_departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  active boolean DEFAULT true,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE (patient_id, department_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients USING gin ((to_tsvector('english', coalesce(first_name,'') || ' ' || coalesce(last_name,''))));
CREATE INDEX IF NOT EXISTS idx_patient_numbers_number ON patient_numbers (number);
CREATE INDEX IF NOT EXISTS idx_departments_code ON departments (code);

-- Seed sample departments
INSERT INTO departments (code, name, description)
VALUES
  ('GEN', 'General', 'General department'),
  ('PED', 'Pediatrics', 'Pediatrics department'),
  ('SUR', 'Surgery', 'Surgery department')
ON CONFLICT (code) DO NOTHING;
