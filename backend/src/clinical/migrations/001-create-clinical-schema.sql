-- Clinical: consultations, prescriptions, prescription_items, drugs, drug_categories, lab_requests

CREATE TABLE IF NOT EXISTS drug_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  daily_limit int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS drugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category_id uuid REFERENCES drug_categories(id) ON DELETE SET NULL,
  description text
);

CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  diagnosis text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE,
  prescribed_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prescription_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE,
  drug_id uuid REFERENCES drugs(id) ON DELETE SET NULL,
  quantity int NOT NULL,
  instructions text
);

CREATE TABLE IF NOT EXISTS lab_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE,
  requested_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  test_name text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drugs_name ON drugs (name);
CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations (patient_id, created_at);
CREATE INDEX IF NOT EXISTS idx_prescriptions_prescribed_by ON prescriptions (prescribed_by_id, created_at);
