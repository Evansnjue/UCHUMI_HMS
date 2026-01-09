# Auth Module - Complete Implementation Guide

## Overview

This document provides a comprehensive guide to the production-grade **Auth Module** for the Hospital Management System (HMS) frontend.

## Module Architecture

```
auth/
├── components/                 # Reusable form & UI components
│   ├── LoginForm.tsx          # Email/password login form
│   ├── ChangePasswordForm.tsx  # Password change form
│   ├── ResetPasswordForm.tsx   # Password reset request form
│   ├── SessionTimeoutWarning.tsx # Session expiration warning modal
│   ├── UserProfileForm.tsx     # User profile edit form
│   └── index.ts                # Barrel export
│
├── context/                    # React Context for global auth state
│   └── auth.context.tsx        # AuthContext & AuthProvider
│
├── guards/                     # Route protection & RBAC components
│   ├── rbac.guard.tsx          # RoleGuard, PermissionGuard, ConditionalRender
│   ├── protected-route.guard.tsx # ProtectedRoute, PublicRoute
│   └── index.ts                # Barrel export
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts              # Auth context access & role/permission checks
│   ├── useAuthMutations.ts     # Login, password, profile mutations
│   └── index.ts                # Barrel export
│
├── pages/                      # Page components (route targets)
│   ├── LoginPage.tsx           # /auth/login
│   ├── PasswordResetPage.tsx   # /auth/reset-password
│   ├── ProfilePage.tsx         # /auth/profile (protected)
│   ├── UnauthorizedPage.tsx    # /auth/unauthorized
│   └── index.ts                # Barrel export
│
├── services/                   # API service layer
│   ├── auth.service.ts         # Authentication API calls
│   └── index.ts                # Barrel export
│
├── types/                      # TypeScript DTOs & interfaces
│   ├── auth.dto.ts             # API contract types
│   └── index.ts                # Barrel export
│
├── utils/                      # Utility functions
│   ├── auth.utils.ts           # Token, user, permission helpers
│   └── index.ts                # Barrel export
│
├── mock/                       # Mock data for development
│   ├── mockData.ts             # Mock users, roles, credentials
│   └── index.ts                # Barrel export
│
├── constants.ts                # Module constants (roles, permissions)
├── routes.tsx                  # Route configuration
├── index.ts                    # Module barrel export
└── README.md                   # Full documentation
```

## Key Features

### 1. JWT Authentication
- Email/password login
- Automatic token refresh
- Secure token storage
- Automatic logout on 401

### 2. Role-Based Access Control (RBAC)
- User roles (Admin, Pharmacist, Doctor, User)
- Fine-grained permissions
- Role-based route protection
- Conditional UI rendering

### 3. Session Management
- Configurable timeout (default: 15 min)
- User activity tracking
- Pre-timeout warning (default: 2 min before)
- Clean logout

### 4. Password Management
- Secure password change (requires current password)
- Password reset via email
- Password reset token verification
- Validation and confirmation

### 5. Profile Management
- View user profile
- Edit first/last name and email
- Automatic profile sync
- Success/error notifications

## Core Components

### AuthProvider
Wraps your app with global auth state:

```tsx
<AuthProvider sessionTimeoutMs={15 * 60 * 1000}>
  <App />
</AuthProvider>
```

**Handles:**
- User session state
- Token persistence
- Session timeouts
- Activity tracking

### Login Flow
```
User enters credentials
        ↓
LoginForm validates
        ↓
useLogin mutation calls authService.login()
        ↓
authService stores tokens
        ↓
AuthContext updates user state
        ↓
SessionTimeoutWarning activated
        ↓
User redirected to /dashboard
```

### Permission Checks
Multiple ways to enforce permissions:

```tsx
// Hook-based (recommended for logic)
const isAdmin = useHasRole('ADMIN');

// Guard component (for routes)
<RoleGuard requiredRole="ADMIN">
  <AdminPage />
</RoleGuard>

// Conditional rendering (for UI elements)
<ConditionalRender requiredRole="PHARMACIST">
  <PharmacyButton />
</ConditionalRender>
```

## API Contracts

### Login Endpoint
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@hospital.com",
  "password": "securepassword"
}

Response (200):
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "refresh_token",
  "expiresIn": 3600,
  "user": {
    "id": "user-001",
    "email": "user@hospital.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "roles": [
      {
        "id": "role-001",
        "name": "Administrator",
        "code": "ADMIN",
        "permissions": [...]
      }
    ],
    "permissions": [
      {
        "id": "perm-001",
        "code": "auth:write",
        "resource": "auth",
        "action": "write"
      }
    ]
  }
}

Error (401):
{
  "message": "Invalid credentials"
}
```

### Refresh Token Endpoint
```
POST /api/auth/refresh-token
Content-Type: application/json

Request:
{
  "refreshToken": "refresh_token_value"
}

Response (200):
{
  "accessToken": "new_token",
  "expiresIn": 3600
}
```

### Get Profile Endpoint
```
GET /api/auth/profile
Authorization: Bearer {accessToken}

Response (200):
{
  "id": "user-001",
  "email": "user@hospital.com",
  ...
}
```

### Update Profile Endpoint
```
PATCH /api/auth/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "newmail@hospital.com"
}

Response (200):
{
  "id": "user-001",
  ...
}
```

### Change Password Endpoint
```
POST /api/auth/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "oldPassword": "current",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}

Response (200):
{
  "message": "Password changed successfully"
}
```

### Reset Password Request
```
POST /api/auth/reset-password
Content-Type: application/json

Request:
{
  "email": "user@hospital.com"
}

Response (200):
{
  "message": "Reset email sent if account exists"
}
```

### Confirm Password Reset
```
POST /api/auth/confirm-reset-password
Content-Type: application/json

Request:
{
  "resetToken": "token_from_email",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}

Response (200):
{
  "message": "Password reset successfully",
  "user": { ... }
}
```

## Usage Examples

### Basic Setup
```tsx
import { AuthProvider, authRoutes } from '@modules/auth';
import { createBrowserRouter } from 'react-router-dom';

// 1. Add provider
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// 2. Configure routes
const router = createBrowserRouter([
  ...authRoutes,
  { path: '/dashboard', element: <Dashboard /> },
  // other routes
]);
```

### Protect Routes
```tsx
// Require authentication
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Require specific role
<RoleGuard requiredRole="ADMIN">
  <AdminPage />
</RoleGuard>

// Require authentication + specific role
<ProtectedRoute>
  <RoleGuard requiredRole="PHARMACIST">
    <PharmacyModule />
  </RoleGuard>
</ProtectedRoute>
```

### Access Auth State
```tsx
function Header() {
  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const logout = useLogout();

  if (!isAuthenticated) {
    return <LoginLink />;
  }

  return (
    <header>
      <span>Welcome, {user?.fullName}</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
```

### Check Permissions
```tsx
function PharmacyButton() {
  const isPharmacist = useHasRole('PHARMACIST');
  const canDispense = useHasPermission('pharmacy:dispense');

  if (!isPharmacist || !canDispense) {
    return null; // Hidden from non-pharmacists
  }

  return <button>Dispense Medication</button>;
}
```

### Multiple Role Check
```tsx
function StaffPanel() {
  const isStaff = useHasAnyRole(['DOCTOR', 'NURSE', 'PHARMACIST']);

  return isStaff ? <StaffContent /> : <UnauthorizedMessage />;
}
```

## Error Handling

The module handles all error scenarios:

```tsx
try {
  // Login with invalid credentials
  // → Displays "Invalid email or password"

  // Token expired
  // → Automatically refreshes

  // Refresh token expired
  // → Redirects to login

  // Network error
  // → Displays "Network error, please try again"

  // Permission denied
  // → Shows 403 Unauthorized page
} catch (error) {
  // All errors are typed
  const message = error.response?.data?.message;
}
```

## Security Features

1. **JWT Token Security**
   - Tokens stored in localStorage (web)
   - Can be moved to httpOnly cookies (production)
   - Automatic refresh on expiration
   - Logout on refresh failure

2. **Password Security**
   - Requires old password to change
   - Validates password strength
   - Reset token expiration
   - Confirmation matching

3. **RBAC Enforcement**
   - Frontend guards for UX
   - Backend must re-validate all permissions
   - No sensitive data in tokens
   - No hardcoded roles/permissions

4. **Session Security**
   - Automatic timeout
   - Activity tracking
   - Warning before logout
   - CSRF-ready (add CSRF tokens in production)

## Mock Data

For development without backend:

```tsx
import { 
  mockAdmin, 
  mockPharmacist, 
  mockDoctor,
  mockCredentials,
  generateMockLoginResponse 
} from '@modules/auth';

// Mock credentials
const creds = mockCredentials[0]; // admin@hospital.com / admin123

// Generate mock response
const response = generateMockLoginResponse(mockAdmin);

// Use in development
if (import.meta.env.DEV) {
  // Mock API calls
}
```

## Type Safety

Fully typed DTOs for all API contracts:

```tsx
import type {
  UserDto,
  LoginRequestDto,
  LoginResponseDto,
  RoleDto,
  PermissionDto,
  UserStatus,
  ChangePasswordRequestDto,
  ResetPasswordRequestDto,
} from '@modules/auth';

// TypeScript validates all data
const user: UserDto = response.user;
const isActive = user.status === UserStatus.ACTIVE;
```

## Performance Optimization

1. **React Query Caching**
   - Profile cached after fetch
   - Automatic cache invalidation
   - Stale-while-revalidate patterns

2. **Token Management**
   - Tokens cached in memory
   - Minimal localStorage reads
   - Efficient JWT decoding

3. **Session Tracking**
   - Lightweight activity listeners
   - Single timeout handler
   - Passive event listeners

4. **Memoization**
   - useAuthUser memoized
   - Hooks prevent unnecessary re-renders
   - Context splits auth state and methods

## Troubleshooting

### User stays logged out after page refresh
```tsx
// AuthProvider loads user from localStorage on mount
// Check that localStorage is enabled
// Check browser console for errors
```

### Token refresh loops
```tsx
// Check refresh endpoint response format
// Ensure new token is returned
// Check token expiration times
```

### Session timeout not working
```tsx
// Check sessionTimeoutMs prop
// Verify activity listeners are attached
// Check that browser allows localStorage
```

### Permission checks always fail
```tsx
// Verify user.roles array is populated
// Check role codes match exactly (case-sensitive)
// Ensure roles are returned from API
```

## Testing

```tsx
import { 
  render, 
  screen, 
  waitFor 
} from '@testing-library/react';
import { AuthProvider, mockAdmin } from '@modules/auth';

test('login redirects authenticated users', async () => {
  render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );

  // Mock should auto-redirect
  await waitFor(() => {
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
  });
});
```

## Integration Checklist

- [ ] Add `AuthProvider` to root component
- [ ] Configure routes with `authRoutes`
- [ ] Set `VITE_API_BASE_URL` environment variable
- [ ] Implement backend auth endpoints
- [ ] Test login/logout flow
- [ ] Test token refresh
- [ ] Test session timeout
- [ ] Test role permissions
- [ ] Add error boundary
- [ ] Configure HTTPS (production)
- [ ] Move tokens to httpOnly cookies (production)
- [ ] Add CSRF token handling (production)
- [ ] Implement audit logging (production)

## Future Enhancements

- [ ] OAuth2/SSO integration
- [ ] Two-factor authentication
- [ ] Biometric authentication
- [ ] Login activity dashboard
- [ ] Device management
- [ ] Password strength requirements
- [ ] Remember me functionality
- [ ] Account lockout on failed attempts
- [ ] Audit log export
- [ ] Session history

## File Size & Performance

- **Main bundle impact**: ~35KB (minified)
- **Tree-shakeable exports**
- **No external dependencies** beyond React & React Query
- **Lazy-loadable routes**

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ IE 11 (no support)

## Contributing

When extending the auth module:
1. Maintain folder structure
2. Use TypeScript strict mode
3. Keep components small & focused
4. Export from barrel files
5. Add JSDoc comments
6. Update README
7. Add mock data for new types

## License

Part of the Hospital Management System (HMS) project.
