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
}
