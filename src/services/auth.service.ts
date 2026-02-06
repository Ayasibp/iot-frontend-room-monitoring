import { api } from '@/lib/api'
import { API_ENDPOINTS } from '@/lib/constants'
import type { User } from '@/types/auth'

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  success: boolean
  data: {
    access_token: string
    user: User
  }
}

interface LogoutResponse {
  success: boolean
  message: string
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse['data']> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      json: credentials,
    }).json<LoginResponse>()
    
    return response.data
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT).json<LogoutResponse>()
  },

  async refresh(): Promise<LoginResponse['data']> {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH).json<LoginResponse>()
    return response.data
  },
}
