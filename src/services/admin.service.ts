import { api } from '@/lib/api'
import { API_ENDPOINTS } from '@/lib/constants'
import type { User } from '@/types/auth'

interface UsersResponse {
  success: boolean
  data: User[]
}

interface CreateUserRequest {
  username: string
  password: string
  role: 'admin' | 'user'
}

interface CreateUserResponse {
  success: boolean
  data: User
  message: string
}

export const adminService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS).json<UsersResponse>()
    return response.data
  },

  async createUser(user: CreateUserRequest): Promise<User> {
    const response = await api.post(API_ENDPOINTS.ADMIN.USERS, {
      json: user,
    }).json<CreateUserResponse>()
    return response.data
  },
}
