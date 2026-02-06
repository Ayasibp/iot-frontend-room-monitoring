import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, User } from '@/types/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setAuth: (user: User, token: string) => {
        set({ user, accessToken: token })
      },
      clearAuth: () => {
        set({ user: null, accessToken: null })
      },
      isAuthenticated: () => {
        const state = get()
        return state.user !== null && state.accessToken !== null
      },
      isAdmin: () => {
        const state = get()
        return state.user?.role === 'admin'
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
)
