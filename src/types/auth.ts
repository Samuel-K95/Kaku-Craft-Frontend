export type UserRole = 'user' | 'customer' | 'expert' | 'admin' | 'super_admin' | 'system_admin';

export interface User {
  id: string | number;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
  dateJoined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface BackendUserPayload {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  profile_picture: string | null;
  date_joined: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: BackendUserPayload;
}

export interface RegisterResponse {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface RefreshResponse {
  access: string;
}
