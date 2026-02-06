import ky, { type KyInstance } from 'ky'
import { useAuthStore } from '@/store/auth'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Create a separate instance for refresh token requests to avoid infinite loops
const refreshClient = ky.create({
  prefixUrl: BASE_URL,
  credentials: 'include',
  timeout: 10000,
})

// Main API client with authentication and auto-refresh
export const api: KyInstance = ky.create({
  prefixUrl: BASE_URL,
  credentials: 'include',
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().accessToken
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        // Handle 401: Try to refresh the access token
        if (response.status === 401) {
          try {
            const refreshResponse = await refreshClient.post('auth/refresh').json<{
              access_token: string
              user: {
                id: number
                username: string
                role: 'admin' | 'user'
              }
            }>()

            // Update the store with the new token and user
            useAuthStore.getState().setAuth(refreshResponse.user, refreshResponse.access_token)

            // Retry the original request with the new token
            request.headers.set('Authorization', `Bearer ${refreshResponse.access_token}`)
            return ky(request)
          } catch (error) {
            // Refresh failed, clear auth and redirect to login
            useAuthStore.getState().clearAuth()
            
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
              window.location.href = '/login'
            }
            
            throw error
          }
        }

        return response
      },
    ],
  },
})

export { BASE_URL }
