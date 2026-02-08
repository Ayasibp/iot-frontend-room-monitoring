export const SENSOR_THRESHOLDS = {
  temperature: { min: 20, max: 24, warning: 25 },
  humidity: { min: 30, max: 60, warning: 70 },
  pressure: { min: 2.5, warning: 2.0 },
  oxygen: { min: 50, warning: 45 },
  nitrous: { min: 50, warning: 45 },
  air: { min: 50, warning: 45 },
  vacuum: { min: 50, warning: 45 },
  instrument: { min: 50, warning: 45 },
  carbon: { max: 5, warning: 3 },
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    REFRESH: 'auth/refresh',
  },
  THEATER: {
    STATE: 'theater/state',
    TIMER_OP: 'theater/timer/op',
    TIMER_CD: 'theater/timer/cd',
    TIMER_CD_ADJUST: 'theater/timer/cd/adjust',
  },
  V1: {
    HOSPITALS: 'api/v1/hospitals',
    HOSPITAL_BY_ID: (id: number) => `api/v1/hospitals/${id}`,
    HOSPITAL_ROOMS: (hospitalId: number) => `api/v1/hospitals/${hospitalId}/rooms`,
    ROOMS: 'api/v1/rooms',
    ROOM_BY_ID: (id: number) => `api/v1/rooms/${id}`,
    DASHBOARD_ROOM: (roomId: number) => `api/v1/dashboard/rooms/${roomId}`,
    DASHBOARD_TIMER_OP: (roomId: number) => `api/v1/dashboard/rooms/${roomId}/timer/op`,
    DASHBOARD_TIMER_CD: (roomId: number) => `api/v1/dashboard/rooms/${roomId}/timer/cd`,
    DASHBOARD_TIMER_CD_ADJUST: (roomId: number) => `api/v1/dashboard/rooms/${roomId}/timer/cd/adjust`,
  },
  ADMIN: {
    USERS: 'admin/users',
  },
} as const
