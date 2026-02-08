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
  async getRoomState(roomId: number): Promise<TheaterState> {
    const response = await api.get(API_ENDPOINTS.V1.DASHBOARD_ROOM(roomId)).json<TheaterStateResponse>()
    return response.data
  },

  async controlTimer(roomId: number, action: TimerAction): Promise<string> {
    const response = await api.post(API_ENDPOINTS.V1.DASHBOARD_TIMER_OP(roomId), {
      json: action,
    }).json<TimerResponse>()
    return response.message
  },

  async controlCountdownTimer(roomId: number, action: CountdownTimerAction): Promise<string> {
    const response = await api.post(API_ENDPOINTS.V1.DASHBOARD_TIMER_CD(roomId), {
      json: action,
    }).json<TimerResponse>()
    return response.message
  },

  async adjustCountdownTimer(roomId: number, minutes: 1 | -1): Promise<string> {
    const response = await api.patch(API_ENDPOINTS.V1.DASHBOARD_TIMER_CD_ADJUST(roomId), {
      json: { minutes },
    }).json<TimerResponse>()
    return response.message
  },
}
