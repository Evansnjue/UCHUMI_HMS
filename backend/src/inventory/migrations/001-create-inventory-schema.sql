-- Inventory module schema
-- Tables: departments, inventory_items, stock_movements

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text,
  batch text,
  expiry_date date,
  quantity numeric NOT NULL DEFAULT 0,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  product_type text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory_items USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory_items (sku);
CREATE INDEX IF NOT EXISTS idx_inventory_batch ON inventory_items (batch);

CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  from_department uuid REFERENCES departments(id) ON DELETE SET NULL,
  to_department uuid REFERENCES departments(id) ON DELETE SET NULL,
  delta numeric NOT NULL,
  reason text,
  type text NOT NULL CHECK (type IN ('ADD','REMOVE','TRANSFER')),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_movements_item ON stock_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_movements_created_by ON stock_movements(created_by);

-- Seed a few departments (include code to be compatible with patient departments)
INSERT INTO departments (code, name, description) VALUES ('CENT', 'Central Store', 'Central inventory store') ON CONFLICT (code) DO NOTHING;
INSERT INTO departments (code, name, description) VALUES ('PHARM', 'Pharmacy', 'Pharmacy department') ON CONFLICT (code) DO NOTHING;
INSERT INTO departments (code, name, description) VALUES ('SUR', 'Surgery', 'Surgery department') ON CONFLICT (code) DO NOTHING;

-- Audit table reuse: pharmacy_audit exists, reuse for inventory events as well
