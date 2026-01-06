-- Billing & Finance schema

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  consultation_id uuid REFERENCES consultations(id) ON DELETE SET NULL,
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE SET NULL,
  lab_request_id uuid REFERENCES lab_requests(id) ON DELETE SET NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  insurance_provider text,
  insurance_covered_amount numeric DEFAULT 0,
  patient_responsible numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'UNPAID', -- UNPAID, PARTIAL, PAID, CANCELLED
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

CREATE TABLE IF NOT EXISTS billing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_billing_items_invoice ON billing_items(invoice_id);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  method text NOT NULL, -- CASH, MOBILE_MONEY, INSURANCE
  provider text, -- e.g., M-Pesa, Insurance Company
  reference text,
  received_by uuid REFERENCES users(id) ON DELETE SET NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);

-- Audit reuse: pharmacy_audit is available, but billing can use it for events
