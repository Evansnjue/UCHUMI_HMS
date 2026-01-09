# Auth Module

Production-grade authentication and authorization module for the Hospital Management System (HMS).

## Features

- **JWT-based Authentication**: Secure token-based login with refresh token support
- **Role-Based Access Control (RBAC)**: Fine-grained permission and role management
- **Session Management**: Automatic session timeout with user notification
- **Password Management**: Secure password change and reset functionality
- **Profile Management**: User profile viewing and editing
- **Route Protection**: Protected routes with role/permission enforcement
- **Token Management**: Automatic token refresh and expiration handling
- **Multi-role Support**: Support for multiple roles per user

## Folder Structure

```
auth/
├── components/           # Reusable form components
│   ├── LoginForm.tsx
│   ├── ChangePasswordForm.tsx
│   ├── ResetPasswordForm.tsx
│   ├── SessionTimeoutWarning.tsx
│   ├── UserProfileForm.tsx
│   └── index.ts
├── context/             # React Context for auth state
│   └── auth.context.tsx
├── guards/              # Route & permission guards
│   ├── rbac.guard.tsx
│   ├── protected-route.guard.tsx
│   └── index.ts
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useAuthMutations.ts
│   └── index.ts
├── mock/                # Mock data for development
│   ├── mockData.ts
│   └── index.ts
├── pages/               # Page components
│   ├── LoginPage.tsx
│   ├── PasswordResetPage.tsx
│   ├── ProfilePage.tsx
│   ├── UnauthorizedPage.tsx
│   └── index.ts
├── services/            # API service layer
│   ├── auth.service.ts
│   └── index.ts
├── types/               # TypeScript type definitions
│   ├── auth.dto.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── auth.utils.ts
│   └── index.ts
├── constants.ts         # Module constants
├── routes.tsx           # Route configuration
└── index.ts             # Module barrel export
```

## Setup

### 1. Add Auth Provider to App

Wrap your application with `AuthProvider`:

```tsx
import { AuthProvider } from '@modules/auth';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Your app routes here */}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### 2. Configure Routes

```tsx
import { authRoutes } from '@modules/auth';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  ...authRoutes,
  // Other module routes
]);
```

### 3. Protect Routes

Use `ProtectedRoute` to require authentication:

```tsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

Use `PublicRoute` for login/signup (auto-redirects authenticated users):

```tsx
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

## Usage

### Authentication

```tsx
import { useAuth, useLogin } from '@modules/auth';

function LoginComponent() {
  const { setUser } = useAuth();
  const { mutate: login } = useLogin();

  const handleLogin = (email: string, password: string) => {
    login({ email, password }, {
      onSuccess: (response) => {
        setUser(response.user);
      },
    });
  };

  return (
    // Your login form
  );
}
```

### Access User Info

```tsx
import { useAuthUser, useIsAuthenticated } from '@modules/auth';

function UserMenu() {
  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return <LoginButton />;

  return (
    <div>
      <p>{user?.fullName}</p>
      <p>{user?.email}</p>
    </div>
  );
}
```

### Check Permissions

```tsx
import { useHasRole, useHasPermission } from '@modules/auth';

function AdminPanel() {
  const isAdmin = useHasRole('ADMIN');
  const canWrite = useHasPermission('auth:write');

  if (!isAdmin || !canWrite) {
    return <UnauthorizedMessage />;
  }

  return <AdminContent />;
}
```

### Conditional Rendering

```tsx
import { ConditionalRender } from '@modules/auth';

<ConditionalRender requiredRole="ADMIN">
  <AdminOnlyContent />
</ConditionalRender>

<ConditionalRender 
  requiredRoles={['PHARMACIST', 'DOCTOR']} 
  fallback={<UnauthorizedMessage />}
>
  <ProtectedContent />
</ConditionalRender>
```

### Role Guards

```tsx
import { RoleGuard, AnyRoleGuard, AllRolesGuard } from '@modules/auth';

// Single role required
<RoleGuard requiredRole="ADMIN" redirectTo="/auth/unauthorized">
  <AdminPage />
</RoleGuard>

// Any of these roles
<AnyRoleGuard 
  requiredRoles={['ADMIN', 'PHARMACIST']} 
  fallback={<NotAuthorized />}
>
  <StaffPage />
</AnyRoleGuard>

// All roles required
<AllRolesGuard requiredRoles={['ADMIN', 'SUPERVISOR']}>
  <SuperAdminPage />
</AllRolesGuard>
```

## API Integration

The auth module uses axios for API communication with automatic:
- Token attachment to requests
- Automatic token refresh on 401 responses
- Logout on failed refresh

### Implementing Backend API

The module expects the following endpoints:

```
POST   /api/auth/login              # User login
POST   /api/auth/refresh-token      # Refresh access token
POST   /api/auth/change-password    # Change password
POST   /api/auth/reset-password     # Request password reset
POST   /api/auth/confirm-reset-password  # Confirm password reset
GET    /api/auth/profile            # Get user profile
PATCH  /api/auth/profile            # Update user profile
GET    /api/auth/verify-reset-token/:token # Verify reset token
```

### Response Formats

**Login Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "refresh_token_value",
  "expiresIn": 3600,
  "user": {
    "id": "user-001",
    "email": "admin@hospital.com",
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
    "permissions": [...]
  }
}
```

## Session Timeout

The module automatically handles session timeouts:

- Default timeout: 15 minutes
- Warning shown: 2 minutes before timeout
- Customizable via `AuthProvider` props

```tsx
<AuthProvider 
  sessionTimeoutMs={30 * 60 * 1000}
  warningTimeBeforeTimeoutMs={5 * 60 * 1000}
>
  {children}
</AuthProvider>
```

## Token Management

Tokens are automatically stored and managed:

```tsx
import { authService } from '@modules/auth';

// Get tokens
const accessToken = authService.getAccessToken();
const refreshToken = authService.getRefreshToken();

// Check authentication
const isAuthenticated = authService.isAuthenticated();

// Manual logout
authService.logout();
```

## Utility Functions

```tsx
import { 
  decodeToken,
  isTokenExpired,
  hasRole,
  hasPermission 
} from '@modules/auth';

// Decode JWT (client-side only, not verified)
const decoded = decodeToken(token);

// Check expiration
const expired = isTokenExpired(token);

// Check roles/permissions
const isAdmin = hasRole(user, 'ADMIN');
const canEdit = hasPermission(user, 'auth:write');
```

## Mock Data

For development, mock data is available:

```tsx
import { mockAdmin, mockPharmacist, mockDoctor } from '@modules/auth';

const currentUser = mockAdmin;
```

Mock credentials:
```
Admin:       admin@hospital.com / admin123
Pharmacist:  pharmacist@hospital.com / pharm123
Doctor:      doctor@hospital.com / doctor123
```

## Type Definitions

All API contracts are fully typed with TypeScript:

```tsx
import type {
  UserDto,
  LoginRequestDto,
  LoginResponseDto,
  RoleDto,
  PermissionDto,
  UserStatus,
} from '@modules/auth';
```

## Security Best Practices

1. **Never expose tokens in URLs or localStorage directly for sensitive operations**
   - Use httpOnly cookies for refresh tokens in production
   - Current implementation uses localStorage (fine for web, not ideal for sensitive data)

2. **Always validate on the backend**
   - Frontend guards are for UX only
   - Backend must re-validate all permissions

3. **Use HTTPS in production**
   - Tokens are transmitted over HTTP in this setup

4. **Implement CSRF protection**
   - Add CSRF tokens to requests in production

5. **Regular token rotation**
   - Refresh tokens frequently
   - Implement expiration

## Error Handling

The module includes comprehensive error handling:

- Network errors
- 401 Unauthorized responses
- Invalid credentials
- Token refresh failures
- Permission violations

All error messages are i18n-ready (use translation keys).

## Testing

Mock components and data are provided for testing:

```tsx
import { mockAdmin, generateMockLoginResponse } from '@modules/auth';

// Use mock data in tests
const mockResponse = generateMockLoginResponse(mockAdmin);
```

## Future Enhancements

- [ ] OAuth2/SSO integration
- [ ] Two-factor authentication
- [ ] Biometric authentication
- [ ] Session management dashboard
- [ ] Login activity logs
- [ ] Device management
- [ ] Password strength requirements
- [ ] Audit logging

## Performance Considerations

- Auth tokens are cached in memory (via context)
- User profile is fetched once on app load
- React Query caches API responses
- Session timeout monitoring has minimal overhead
- RBAC checks are O(n) where n = number of roles/permissions

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- IE 11 not supported

## License

Part of the Hospital Management System (HMS) project.
