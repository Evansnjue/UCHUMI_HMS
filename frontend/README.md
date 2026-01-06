# Auth Module (Frontend)

This folder contains a small React scaffold for authentication pages:

- `LoginPage` — simple login form that calls `/auth/login`
- `AdminUsersPage` — placeholder UI for admin user management
- `AuthProvider` — React context that holds `token` and `user` and exposes `login`/`logout`

Notes:
- Store tokens in httpOnly cookies where possible; for this example an in-memory token is used.
- Use `ProtectedRoute` wrappers to enforce role-based access on the client side.
