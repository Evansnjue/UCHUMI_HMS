-- Add doctor_drug_limits table to allow per-doctor overrides for category limits

CREATE TABLE IF NOT EXISTS doctor_drug_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES drug_categories(id) ON DELETE CASCADE,
  daily_limit int DEFAULT 0,
  UNIQUE (doctor_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_doctor_limits_doctor ON doctor_drug_limits (doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_limits_category ON doctor_drug_limits (category_id);
