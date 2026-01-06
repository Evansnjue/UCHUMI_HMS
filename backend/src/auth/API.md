# Auth API Documentation

## Endpoints

POST /auth/login
- Body: { email: string, password: string }
- Response: { accessToken: string }
- Security: Rate-limit to prevent brute force

POST /auth/logout
- Header: Authorization: Bearer <token>
- Response: { success: true }
- Behavior: Server should revoke token (e.g., add to Redis blacklist)

POST /auth/password-reset/request
- Body: { email: string }
- Response: { token: string } (for demo; in production the token is emailed)

POST /auth/password-reset/confirm
- Body: { token: string, newPassword: string }
- Response: 200 OK

GET /auth/profile
- Header: Authorization: Bearer <token>
- Response: { id, email, firstName, lastName, roles }

PATCH /auth/profile
- Header: Authorization: Bearer <token>
- Body: { firstName?, lastName? }
- Response: updated profile

POST /auth/admin/users/:id/roles
- Header: Authorization: Bearer <admin-token>
- Body: { roles: string[] }
- Response: updated user
- Permissions: Admin only; emits `UserRoleChanged` event

## Events
- `UserLoggedIn` — published after successful login
  - Payload: { userId: string, at: ISOString }
- `UserRoleChanged` — published after role updates
  - Payload: { userId: string, roles: string[] }

## Security & Best Practices
- JWT: sign with strong secret or RSA keys; use refresh tokens for long sessions
- Store tokens in httpOnly cookies to avoid XSS token leakage
- Implement token revocation and session invalidation on critical changes (role change, password reset)
- Use rate limiting and account lockout thresholds
- Enforce RBAC on server-side with roles & permissions, never rely solely on client checks

## Notes on Production
- Use a dedicated message broker (NATS, Kafka) for cross-service events with schema validation
- Add audit logging for security-sensitive operations (login, role change)
- Add monitoring/alerting on auth-related anomalies
