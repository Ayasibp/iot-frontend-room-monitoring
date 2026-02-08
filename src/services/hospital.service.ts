import { api } from '@/lib/api'
import { API_ENDPOINTS } from '@/lib/constants'
import type { Hospital, Room } from '@/types/theater'

interface HospitalsResponse {
  success: boolean
  data: { hospitals: Hospital[]; count: number }
}

interface RoomsResponse {
  success: boolean
  data: { rooms: Room[]; count: number }
}

export const hospitalService = {
  async getHospitals(): Promise<Hospital[]> {
    const response = await api.get(API_ENDPOINTS.V1.HOSPITALS).json<HospitalsResponse>()
    return response.data.hospitals
  },

  async getHospitalById(id: number): Promise<Hospital> {
    const response = await api.get(API_ENDPOINTS.V1.HOSPITAL_BY_ID(id)).json<{ success: boolean; data: Hospital }>()
    return response.data
  },

  async getHospitalRooms(hospitalId: number): Promise<Room[]> {
    const response = await api.get(API_ENDPOINTS.V1.HOSPITAL_ROOMS(hospitalId)).json<RoomsResponse>()
    return response.data.rooms
  },

  async getAllRooms(): Promise<Room[]> {
    const response = await api.get(API_ENDPOINTS.V1.ROOMS).json<RoomsResponse>()
    return response.data.rooms
  },
}
