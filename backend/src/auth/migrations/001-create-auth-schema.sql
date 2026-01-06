-- Create users, roles, permissions and many-to-many tables

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text
);

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  password text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Indexes for quick lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles (name);
CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions (name);

-- Seed core roles
INSERT INTO roles (id, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin', 'Full access'),
  ('00000000-0000-0000-0000-000000000002', 'Doctor', 'Clinical staff'),
  ('00000000-0000-0000-0000-000000000003', 'Receptionist', 'Front-desk'),
  ('00000000-0000-0000-0000-000000000004', 'Pharmacist', 'Pharmacy staff'),
  ('00000000-0000-0000-0000-000000000005', 'HR', 'Human resources')
ON CONFLICT (name) DO NOTHING;
