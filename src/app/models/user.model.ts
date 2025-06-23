export enum UserRole {
  ADMIN = "ADMIN",
  DRIVER = "DRIVER",
  SENDER = "SENDER",
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  verified: boolean;
  active: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
}
