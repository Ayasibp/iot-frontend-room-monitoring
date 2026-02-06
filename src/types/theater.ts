export interface TheaterState {
  id: number
  room_name: string
  ach_theoretical: number
  ach_empirical: number
  current_temp: number
  current_pressure: number
  current_humidity?: number
  current_logic_ahu: boolean
  op_start_time: string | null
  op_accumulated_seconds: number
  op_is_running: boolean
  cd_target_time: string | null
  cd_duration_seconds: number
  cd_is_running: boolean
  ahu_cycle_start_time: string | null
  last_processed_raw_id: number
  updated_at: string
  // Medical gases
  oxygen?: number
  nitrous?: number
  air?: number
  vacuum?: number
  instrument?: number
  carbon?: number
}

export interface TimerAction {
  action: 'start' | 'stop' | 'reset'
}
