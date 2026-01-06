# Auth DB Schema

Tables:
- users: stores user basic info and hashed password
  - indexes: unique index on email
  - constraints: email unique, password stored hashed
- roles: role definitions (Admin, Doctor, Receptionist, Pharmacist, HR)
- permissions: fine-grained permission names
- user_roles: many-to-many between users and roles
- role_permissions: many-to-many between roles and permissions

Business rules:
- Emails must be unique and validated at registration
- Passwords hashed using bcrypt with a cost factor >= 12
- Role assignments must be performed by Admin users only
- When roles change, emit `UserRoleChanged` and invalidate sessions (use Redis)
- Login failures should be rate-limited and account lockout applied after several failures

Indexes:
- users.email idx
- roles.name idx
- permissions.name idx

Migration file: `migrations/001-create-auth-schema.sql` contains DDL and seed roles.
