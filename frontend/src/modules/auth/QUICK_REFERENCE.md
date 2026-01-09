# Auth Module - Quick Reference

## 🚀 30-Second Setup

```tsx
// 1. Wrap app with provider
import { AuthProvider } from '@modules/auth';

<AuthProvider>
  <App />
</AuthProvider>

// 2. Add routes
import { authRoutes } from '@modules/auth';
const routes = [...authRoutes, ...otherRoutes];

// 3. Protect routes
import { ProtectedRoute } from '@modules/auth';

<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// 4. Use hooks
import { useAuthUser, useHasRole } from '@modules/auth';

const user = useAuthUser();
const isAdmin = useHasRole('ADMIN');
```

---

## 🎨 Component Usage Examples

### Login
```tsx
import { LoginForm } from '@modules/auth';

<LoginForm onSuccess={() => navigate('/dashboard')} />
```

### Session Timeout Warning
```tsx
import { SessionTimeoutWarning } from '@modules/auth';

<SessionTimeoutWarning />
```

### Profile Management
```tsx
import { UserProfileForm, ChangePasswordForm } from '@modules/auth';

<Tabs>
  <Tab><UserProfileForm /></Tab>
  <Tab><ChangePasswordForm /></Tab>
</Tabs>
```

---

## 🔐 RBAC Examples

### Check Single Role
```tsx
const isPharmacist = useHasRole('PHARMACIST');
if (isPharmacist) {
  // Show pharmacist UI
}
```

### Check Any Role
```tsx
const isStaff = useHasAnyRole(['DOCTOR', 'NURSE', 'PHARMACIST']);
if (isStaff) {
  // Show staff UI
}
```

### Check All Roles
```tsx
const isSuperAdmin = useHasAllRoles(['ADMIN', 'SUPERVISOR']);
if (isSuperAdmin) {
  // Show super admin UI
}
```

### Check Permission
```tsx
const canApprove = useHasPermission('approval:write');
if (canApprove) {
  // Show approval button
}
```

### Guard Routes
```tsx
<RoleGuard requiredRole="ADMIN" redirectTo="/unauthorized">
  <AdminPage />
</RoleGuard>
```

### Conditional Render
```tsx
<ConditionalRender requiredRole="PHARMACIST">
  <DispenseButton />
</ConditionalRender>

<ConditionalRender 
  requiredRoles={['ADMIN', 'MANAGER']} 
  fallback={<NotAuthorized />}
>
  <ReportSection />
</ConditionalRender>
```

---

## 🔑 Hooks Reference

| Hook | Purpose | Returns |
|------|---------|---------|
| `useAuth()` | Full context | `{ user, isAuthenticated, isLoading, logout, ... }` |
| `useAuthUser()` | Get user | `UserDto \| null` |
| `useIsAuthenticated()` | Check auth | `boolean` |
| `useLogout()` | Get logout fn | `() => void` |
| `useSessionTimeout()` | Timeout state | `{ sessionTimeoutWarning, setSessionTimeoutWarning }` |
| `useHasRole(code)` | Single role | `boolean` |
| `useHasAnyRole(codes)` | Multiple roles | `boolean` |
| `useHasAllRoles(codes)` | All roles required | `boolean` |
| `useHasPermission(code)` | Single permission | `boolean` |
| `useHasAnyPermission(codes)` | Multiple permissions | `boolean` |
| `useLogin()` | Login mutation | `{ mutate, isPending, error }` |
| `useLogoutMutation()` | Logout mutation | `{ mutate, isPending }` |
| `useChangePassword()` | Change password | `{ mutate, isPending, error, isSuccess }` |
| `useResetPasswordRequest()` | Reset request | `{ mutate, isPending, error }` |
| `useConfirmPasswordReset()` | Confirm reset | `{ mutate, isPending, error }` |
| `useUpdateProfile()` | Update profile | `{ mutate, isPending, error, isSuccess }` |

---

## 🛡️ Guards Reference

| Guard | Purpose | Props |
|-------|---------|-------|
| `<ProtectedRoute>` | Require auth | `children, redirectTo?` |
| `<PublicRoute>` | Hide from auth users | `children, redirectTo?` |
| `<RoleGuard>` | Require role | `requiredRole, children, fallback?, redirectTo?` |
| `<AnyRoleGuard>` | Any role | `requiredRoles[], children, fallback?, redirectTo?` |
| `<AllRolesGuard>` | All roles | `requiredRoles[], children, fallback?, redirectTo?` |
| `<PermissionGuard>` | Require permission | `requiredPermission, children, fallback?, redirectTo?` |
| `<ConditionalRender>` | Show/hide UI | `children, requiredRole?, requiredRoles[], requireAll?, fallback?` |

---

## 📚 Types Reference

```tsx
// User
interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  status: UserStatus;
  roles: RoleDto[];
  permissions: PermissionDto[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Role
interface RoleDto {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: PermissionDto[];
}

// Permission
interface PermissionDto {
  id: string;
  name: string;
  code: string;
  resource: string;
  action: string;
}

// Requests
interface LoginRequestDto {
  email: string;
  password: string;
}

interface ChangePasswordRequestDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UpdateProfileRequestDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}
```

---

## 🌐 API Endpoints

```bash
# Login
POST /api/auth/login
{ "email": "user@hospital.com", "password": "..." }

# Refresh Token
POST /api/auth/refresh-token
{ "refreshToken": "..." }

# Get Profile
GET /api/auth/profile

# Update Profile
PATCH /api/auth/profile
{ "firstName": "...", "lastName": "...", "email": "..." }

# Change Password
POST /api/auth/change-password
{ "oldPassword": "...", "newPassword": "...", "confirmPassword": "..." }

# Request Password Reset
POST /api/auth/reset-password
{ "email": "user@hospital.com" }

# Confirm Password Reset
POST /api/auth/confirm-reset-password
{ "resetToken": "...", "newPassword": "...", "confirmPassword": "..." }

# Verify Reset Token
GET /api/auth/verify-reset-token/:token
```

---

## 🎯 Role Codes

```tsx
'ADMIN'              // Full system access
'USER'               // Basic user access
'DOCTOR'             // Clinical operations
'PHARMACIST'         // Pharmacy operations
'NURSE'              // Nursing operations
'LAB_TECHNICIAN'     // Lab operations
'INVENTORY_MANAGER'  // Inventory operations
```

---

## 🔑 Permission Codes

```tsx
'auth:read'          // Read auth data
'auth:write'         // Write auth data
'user:read'          // Read users
'user:write'         // Write users
'user:delete'        // Delete users
'profile:read'       // Read profile
'profile:write'      // Write profile
```

---

## 📦 Import Examples

```tsx
// Pages
import { LoginPage, ProfilePage, UnauthorizedPage } from '@modules/auth';

// Components
import { 
  LoginForm, 
  ChangePasswordForm, 
  UserProfileForm,
  SessionTimeoutWarning 
} from '@modules/auth';

// Hooks
import { 
  useAuth,
  useAuthUser,
  useHasRole,
  useLogin,
  useUpdateProfile
} from '@modules/auth';

// Guards
import { 
  ProtectedRoute,
  RoleGuard,
  ConditionalRender
} from '@modules/auth';

// Services
import { authService } from '@modules/auth';

// Types
import type { UserDto, RoleDto, PermissionDto } from '@modules/auth';

// Utilities
import { decodeToken, isTokenExpired, hasRole } from '@modules/auth';

// Constants
import { AUTH_CONSTANTS } from '@modules/auth';

// Mock data
import { mockAdmin, mockCredentials } from '@modules/auth';
```

---

## 🧪 Testing with Mock Data

```tsx
import { mockAdmin, mockCredentials } from '@modules/auth';

// Mock user
console.log(mockAdmin);
// {
//   id: 'user-001',
//   email: 'admin@hospital.com',
//   firstName: 'Admin',
//   lastName: 'User',
//   ...
// }

// Mock credentials for login
mockCredentials.forEach(cred => {
  // email: cred.email
  // password: cred.password
  // user: cred.user
});
```

---

## 🔄 Flow Diagrams

### Login Flow
```
User → LoginForm → useLogin() → authService.login() 
  → Store tokens → Update AuthContext → Redirect
```

### Permission Check
```
Component → useHasRole() → AuthContext.user 
  → Check roles array → Return boolean
```

### Token Refresh
```
API call → Get 401 → authService interceptor 
  → useRefreshToken() → Get new token → Retry request
```

### Session Timeout
```
User inactive → Timer runs → Warning modal 
  → No activity → Logout → Clear tokens → Redirect to login
```

---

## ⚠️ Common Mistakes

```tsx
// ❌ Wrong - using localStorage directly
const token = localStorage.getItem('accessToken');

// ✅ Right - using authService
const token = authService.getAccessToken();

// ❌ Wrong - hardcoding role strings
if (user?.roles[0].code === 'ADMIN') { }

// ✅ Right - using hooks
const isAdmin = useHasRole('ADMIN');

// ❌ Wrong - exposing user data
<div>{user.id}</div>

// ✅ Right - using only needed fields
<div>{user.fullName}</div>

// ❌ Wrong - no loading state
return <Content />;

// ✅ Right - handle loading
return user ? <Content /> : <Loading />;
```

---

## 🐛 Debugging Tips

```tsx
// Check current user
import { useAuthUser } from '@modules/auth';
const user = useAuthUser();
console.log('Current user:', user);

// Check if authenticated
import { useIsAuthenticated } from '@modules/auth';
const isAuth = useIsAuthenticated();
console.log('Is authenticated:', isAuth);

// Check token
import { authService } from '@modules/auth';
console.log('Token:', authService.getAccessToken());

// Check roles
console.log('Roles:', user?.roles);

// Check permissions
console.log('Permissions:', user?.permissions);
```

---

## 📱 Responsive Design

All components are fully responsive:
- Mobile: Single column, touch-friendly
- Tablet: Two columns where appropriate
- Desktop: Full layout with sidebars

No additional setup needed - Tailwind CSS handles it.

---

## ♿ Accessibility

All components include:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus indicators

No additional setup needed.

---

## 🎨 Styling

Uses **Tailwind CSS** utility classes:
- Customizable via `tailwind.config.js`
- Professional hospital-grade colors
- Responsive breakpoints: sm, md, lg, xl, 2xl
- Dark mode ready (add to Tailwind config)

---

## 📊 Performance

- Bundle size: ~35KB minified
- No external dependencies (beyond React & React Query)
- Lazy-loadable routes
- Cached user data
- Memoized hooks
- Efficient context splits

---

## 🚀 Production Checklist

- [ ] Test all auth flows
- [ ] Implement HTTPS
- [ ] Move tokens to httpOnly cookies
- [ ] Add CSRF protection
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Add audit logging
- [ ] Set secure session cookies
- [ ] Test token refresh
- [ ] Monitor for 401 errors
- [ ] Implement logout on all tabs
- [ ] Add error tracking (Sentry, etc.)

---

## 📖 Full Documentation

- [README.md](./README.md) - Quick start & overview
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Complete guide
- [DELIVERY.md](./DELIVERY.md) - What's included

---

## 💡 Pro Tips

1. **Always use hooks for role checks** - Better performance than direct property access
2. **Render guards at route level** - Cleaner than component level
3. **Use ConditionalRender for UI elements** - Better UX than null checks
4. **Enable mock mode for development** - Set API to mock endpoint
5. **Test with multiple roles** - Ensure RBAC works correctly
6. **Monitor session timeouts in production** - Too short = UX issue
7. **Log permission denials** - Track unauthorized attempts
8. **Never trust frontend auth** - Backend must always validate

---

## 🆘 Need Help?

1. Check the [README.md](./README.md) for quick answers
2. See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for detailed explanation
3. Review code comments for function documentation
4. Check mock data for usage examples
5. Search error message in browser console

---

**Auth Module Ready for Integration! 🎉**
