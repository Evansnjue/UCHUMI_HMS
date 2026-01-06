-- Pharmacy module schema
-- Tables: dispensed_drugs, stock, pharmacy_audit

CREATE TABLE IF NOT EXISTS stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id uuid NOT NULL,
  location text NOT NULL DEFAULT 'central',
  quantity numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_stock_drug FOREIGN KEY (drug_id) REFERENCES drugs(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_stock_drug_location ON stock(drug_id, location);

CREATE TABLE IF NOT EXISTS dispensed_drugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_item_id uuid NOT NULL,
  prescription_id uuid NOT NULL,
  drug_id uuid NOT NULL,
  pharmacist_id uuid NOT NULL,
  quantity numeric NOT NULL,
  unit text,
  dispensed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_dispense_prescription_item FOREIGN KEY (prescription_item_id) REFERENCES prescription_items(id) ON DELETE CASCADE,
  CONSTRAINT fk_dispense_prescription FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
  CONSTRAINT fk_dispense_drug FOREIGN KEY (drug_id) REFERENCES drugs(id) ON DELETE CASCADE,
  CONSTRAINT fk_dispense_pharmacist FOREIGN KEY (pharmacist_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_dispensed_prescription ON dispensed_drugs(prescription_id);
CREATE INDEX IF NOT EXISTS idx_dispensed_drug ON dispensed_drugs(drug_id);
CREATE INDEX IF NOT EXISTS idx_dispensed_pharmacist ON dispensed_drugs(pharmacist_id);

-- Simple audit table to keep events and reconciliation info
CREATE TABLE IF NOT EXISTS pharmacy_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
