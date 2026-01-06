# Authentication & RBAC Module (Frontend)

This module provides a production-grade Authentication & RBAC frontend for the HMS app.

Features
- Login, logout, password reset
- User profile editing
- Admin user management (list, edit)
- Auth context + hooks (login/logout, restore session)
- Token refresh handling via axios interceptor
- Session timeout hook + UI
- Role guards and protected routes
- Feature flag provider

How to integrate
1. Install dependencies in your frontend project:
   - react-hook-form, zod, @hookform/resolvers, @tanstack/react-query, axios, @mui/material, react-router-dom

2. Wrap app root (index.tsx) with providers (suggested order):

```tsx
<QueryClientProvider client={queryClient}>
  <FeatureFlagProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryClientProvider>
```

3. Add routes (lazy):
- `/login` -> `LoginPage`
- `/profile` -> protected `ProfilePage`
- `/admin/users` -> protected + role guard `AdminUsersPage`

Security notes
- Prefer issuing refresh tokens via httpOnly cookies from the server.
- Access tokens are kept in sessionStorage here for simplicity; consider memory-only storage for higher security.
- Electron: store refresh token in OS secure store and expose safe IPC methods via preload script.

Electron notes
- Use a preload script to expose a small API for secure token storage (keytar recommended).
- Disable Node integration in renderer to keep surface area small.

Testing
- Unit tests: jest + react-testing-library for hooks and components.
- E2E: Cypress/Playwright for flows (login, renew token, session expiry, admin pages).

Accessibility
- Forms include labels and accessible attributes.
- Dialogs are keyboard-navigable.

If you'd like, I can open a PR that adds test skeletons and wiring into the main app routes. Feedback? 
