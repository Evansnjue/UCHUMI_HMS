-- Lab module: test_catalog, lab_results

CREATE TABLE IF NOT EXISTS test_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  default_units text
);

CREATE TABLE IF NOT EXISTS lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_request_id uuid REFERENCES lab_requests(id) ON DELETE CASCADE,
  test_id uuid REFERENCES test_catalog(id) ON DELETE SET NULL,
  value text NOT NULL,
  units text,
  status text DEFAULT 'PENDING',
  entered_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lab_results_request ON lab_results (lab_request_id);
CREATE INDEX IF NOT EXISTS idx_test_catalog_code ON test_catalog (code);

-- Seed a few sample tests
INSERT INTO test_catalog (code, name, description, default_units)
VALUES
  ('CBC','Complete Blood Count','Hemoglobin, WBC, Platelets','cells/mcL'),
  ('XRAY_CHEST','X-Ray Chest','Chest radiography','image'),
  ('LFT','Liver Function Test','AST/ALT/Bilirubin','U/L')
ON CONFLICT (code) DO NOTHING;
