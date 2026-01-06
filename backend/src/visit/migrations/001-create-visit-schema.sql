-- Visits and queues

INSERT INTO visit_status (name, description) VALUES
  ('QUEUED', 'Visit is queued'),
  ('ACTIVE', 'Visit is in progress'),
  ('COMPLETED', 'Visit completed'),
  ('CANCELLED', 'Visit cancelled')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_number text UNIQUE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  status_id uuid REFERENCES visit_status(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS queues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
  position int,
  enqueued_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visits_visit_number ON visits (visit_number);
CREATE INDEX IF NOT EXISTS idx_queues_department ON queues (department_id, enqueued_at);
