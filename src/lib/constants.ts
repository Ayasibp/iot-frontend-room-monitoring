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

export const ROOM_IDS = ['OT-01', 'OT-02', 'OT-03']

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    REFRESH: 'auth/refresh',
  },
  THEATER: {
    STATE: 'theater/state',
    TIMER_OP: 'theater/timer/op',
  },
  ADMIN: {
    USERS: 'admin/users',
  },
} as const
