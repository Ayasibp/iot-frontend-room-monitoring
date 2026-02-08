import { api } from '@/lib/api'
import { API_ENDPOINTS } from '@/lib/constants'
import type { TheaterState, TimerAction } from '@/types/theater'

interface TheaterStateResponse {
  success: boolean
  data: TheaterState
}

interface TimerResponse {
  success: boolean
  message: string
}

interface CountdownTimerAction {
  action: 'start' | 'stop' | 'reset'
  duration_minutes?: number
}

export const roomService = {
  async getRoomState(roomId: string): Promise<TheaterState> {
    const response = await api.get(`${API_ENDPOINTS.THEATER.STATE}?room=${roomId}`).json<TheaterStateResponse>()
    return response.data
  },

  async controlTimer(roomId: string, action: TimerAction): Promise<string> {
    const response = await api.post(API_ENDPOINTS.THEATER.TIMER_OP, {
      json: { ...action, room: roomId },
    }).json<TimerResponse>()
    return response.message
  },

  async controlCountdownTimer(roomId: string, action: CountdownTimerAction): Promise<string> {
    const response = await api.post(`${API_ENDPOINTS.THEATER.TIMER_CD}?room=${roomId}`, {
      json: action,
    }).json<TimerResponse>()
    return response.message
  },

  async adjustCountdownTimer(roomId: string, minutes: 1 | -1): Promise<string> {
    const response = await api.patch(`${API_ENDPOINTS.THEATER.TIMER_CD_ADJUST}?room=${roomId}`, {
      json: { minutes },
    }).json<TimerResponse>()
    return response.message
  },
}
