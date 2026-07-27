import apiClient from '@/api/apiClient'
import type { ApiResponse } from '@/types/api'
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
} from '@/types/auth'

const authService = {
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<void>>('/auth/register', data).then((r) => r.data),

  verifyEmail: (token: string) =>
    apiClient.get<ApiResponse<void>>('/auth/verify', { params: { token } }).then((r) => r.data),

  resendVerification: (data: ResendVerificationRequest) =>
    apiClient.post<ApiResponse<void>>('/auth/resend-verification', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data).then((r) => r.data),

  refresh: (data: RefreshRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', data).then((r) => r.data),

  logout: (data: RefreshRequest) =>
    apiClient.post<ApiResponse<void>>('/auth/logout', data).then((r) => r.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<void>>('/auth/forgot-password', data).then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ApiResponse<void>>('/auth/reset-password', data).then((r) => r.data),
}

export default authService
