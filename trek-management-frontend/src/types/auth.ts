export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  profilePicture?: string
  roles: Role[]
  emailVerified: boolean
  createdAt: string
}

export type Role = 'ROLE_USER' | 'ROLE_ADMIN'

// Auth API request/response DTOs
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: User
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Auth context state
export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
}
