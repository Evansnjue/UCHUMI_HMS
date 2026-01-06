-- backend/src/procurement/migrations/001-create-procurement-schema.sql

CREATE TABLE procurement_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  contact_name varchar(255),
  contact_email varchar(255),
  phone varchar(50),
  address text,
  terms text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_procurement_suppliers_name ON procurement_suppliers(name);

CREATE TABLE procurement_purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES procurement_suppliers(id) ON DELETE RESTRICT,
  created_by uuid,
  total_amount numeric(12,2) DEFAULT 0,
  currency varchar(10) DEFAULT 'USD',
  status varchar(20) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, RECEIVED
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_procurement_po_supplier_status ON procurement_purchase_orders(supplier_id, status);

CREATE TABLE procurement_purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL REFERENCES procurement_purchase_orders(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  total_price numeric(12,2) NOT NULL DEFAULT 0
);
CREATE INDEX idx_procurement_po_items_po ON procurement_purchase_order_items(purchase_order_id);

CREATE TABLE procurement_insurance_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid,
  claim_number varchar(100) NOT NULL UNIQUE,
  insurer varchar(255) NOT NULL,
  amount numeric(12,2) NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, APPROVED, REJECTED, PAID
  submitted_by uuid,
  processed_by uuid,
  processed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_procurement_claims_insurer_status ON procurement_insurance_claims(insurer, status);

-- Add any necessary constraints or triggers in later migrations
