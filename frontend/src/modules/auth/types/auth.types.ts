export type Role = 'Admin' | 'Doctor' | 'Receptionist' | 'Pharmacist' | 'HR';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  roles: Role[];
  avatarUrl?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
