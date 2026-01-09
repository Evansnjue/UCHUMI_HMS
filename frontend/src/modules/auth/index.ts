/**
 * Auth Module
 * Central exports for the authentication module
 */

// Context & Providers
export { AuthProvider, AuthContext } from './context/auth.context';

// Hooks
export {
  useAuth,
  useAuthUser,
  useIsAuthenticated,
  useLogout,
  useSessionTimeout,
  useHasRole,
  useHasAnyRole,
  useHasAllRoles,
  useHasPermission,
  useHasAnyPermission,
} from './hooks';

export {
  useLogin,
  useLogoutMutation,
  useChangePassword,
  useResetPasswordRequest,
  useConfirmPasswordReset,
  useUpdateProfile,
} from './hooks/useAuthMutations';

// Guards
export {
  RoleGuard,
  AnyRoleGuard,
  AllRolesGuard,
  PermissionGuard,
  ConditionalRender,
  ProtectedRoute,
  PublicRoute,
} from './guards';

// Components
export {
  LoginForm,
  SessionTimeoutWarning,
  ResetPasswordForm,
  ChangePasswordForm,
  UserProfileForm,
} from './components';

// Pages
export {
  LoginPage,
  PasswordResetPage,
  ProfilePage,
  UnauthorizedPage,
} from './pages';

// Services
export { authService } from './services';

// Types
export type {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  UserDto,
  UpdateProfileRequestDto,
  UpdateProfileResponseDto,
  ChangePasswordRequestDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  ConfirmResetPasswordRequestDto,
  ConfirmResetPasswordResponseDto,
  RoleDto,
  PermissionDto,
  SessionDto,
  DecodedTokenDto,
} from './types';

export { UserStatus } from './types';

// Utils
export {
  decodeToken,
  isTokenExpired,
  getTimeUntilExpiration,
  formatUserName,
  formatUserInitials,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  hasPermission,
  hasAnyPermission,
} from './utils';

// Constants
export { AUTH_CONSTANTS, type RoleCode, type PermissionCode } from './constants';

// Routes
export { authRoutes } from './routes';


