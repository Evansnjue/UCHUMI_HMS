export interface UserLoggedInEvent {
  userId: string;
  at: string; // ISO timestamp
}

export interface UserRoleChangedEvent {
  userId: string;
  roles: string[];
}

export type AuthEvents = UserLoggedInEvent | UserRoleChangedEvent;
