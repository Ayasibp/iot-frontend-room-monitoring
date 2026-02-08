import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { roomService } from '@/services/room.service'
import { hospitalService } from '@/services/hospital.service'
import { AppLayout } from '@/components/AppLayout'
import { SensorCard } from '@/components/SensorCard'
import { ACHWidget } from '@/components/ACHWidget'
import { StopwatchWidget } from '@/components/StopwatchWidget'
import { CountdownWidget } from '@/components/CountdownWidget'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Thermometer, Droplets, Gauge, Wind, Activity, Beaker, Building2 } from 'lucide-react'
import { getSensorStatus } from '@/lib/utils'
import { SENSOR_THRESHOLDS } from '@/lib/constants'
import { useAuthStore } from '@/store/auth'

type SearchParams = {
  hospital?: number
  room?: number
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      hospital: search.hospital ? Number(search.hospital) : undefined,
      room: search.room ? Number(search.room) : undefined,
    }
  },
  beforeLoad: ({ context }) => {
    // Require authentication
    if (!context.auth.isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate({ from: '/' })
  const searchParams = Route.useSearch()
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | undefined>(searchParams.hospital)
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(searchParams.room)
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const numericRoomId = selectedRoomId ? Number(selectedRoomId) : undefined

  // Fetch all hospitals
  const { data: hospitals, isLoading: isLoadingHospitals } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => hospitalService.getHospitals(),
  })

  // Fetch rooms for selected hospital
  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ['hospital-rooms', selectedHospitalId],
    queryFn: () => selectedHospitalId ? hospitalService.getHospitalRooms(selectedHospitalId) : Promise.resolve([]),
    enabled: !!selectedHospitalId,
  })

  // Only fetch room state when both hospital and room are selected
  const { data: roomState, isLoading: isLoadingRoomState, isError } = useQuery({
    queryKey: ['room-state', selectedRoomId],
    queryFn: () => selectedRoomId ? roomService.getRoomState(selectedRoomId) : Promise.reject('No room selected'),
    enabled: !!selectedRoomId && !!selectedHospitalId,
    refetchInterval: selectedRoomId ? 2000 : false, // Poll every 2 seconds for live data
  })

  const handleHospitalChange = (value: string) => {
    const hospitalId = Number(value)
    setSelectedHospitalId(hospitalId)
    setSelectedRoomId(undefined) // Reset room selection when hospital changes
    navigate({ search: { hospital: hospitalId } })
  }

  const handleRoomChange = (value: string) => {
    const roomId = Number(value)
    setSelectedRoomId(roomId)
    navigate({ search: { hospital: selectedHospitalId, room: roomId } })
  }

  const selectedHospital = hospitals?.find((h) => h.id === selectedHospitalId)
  const selectedRoom = rooms?.find((r) => r.id === selectedRoomId)

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor all operating theater rooms in real-time
          </p>
        </div>

        {/* Hospital Filter */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Hospital:</label>
            </div>
            <Select 
              value={selectedHospitalId?.toString() || ''} 
              onValueChange={handleHospitalChange}
              disabled={isLoadingHospitals}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a hospital" />
              </SelectTrigger>
              <SelectContent>
                {hospitals?.map((hospital) => (
                  <SelectItem key={hospital.id} value={hospital.id.toString()}>
                    {hospital.name} {hospital.city ? `- ${hospital.city}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Filter - Only shown when hospital is selected */}
          {selectedHospitalId && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-600" />
                <label className="text-sm font-medium text-gray-700">Room:</label>
              </div>
              <Select 
                value={selectedRoomId?.toString() || ''} 
                onValueChange={handleRoomChange}
                disabled={isLoadingRooms}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms?.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.room_name} ({room.room_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Content Area */}
        {isLoadingHospitals ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !selectedHospitalId ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Please select a hospital</p>
            <p className="text-gray-500 text-sm mt-2">Choose a hospital from the dropdown above to continue</p>
          </div>
        ) : !selectedRoomId ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Please select a room</p>
            <p className="text-gray-500 text-sm mt-2">
              {isLoadingRooms ? 'Loading rooms...' : rooms && rooms.length === 0 ? 'No rooms available in this hospital' : 'Choose a room from the dropdown above to view its data'}
            </p>
          </div>
        ) : isLoadingRoomState ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Failed to load room data. Please check your connection.
            </p>
          </div>
        ) : roomState ? (
          <div className="space-y-6">
            {/* Room Header */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRoom?.room_name}</h2>
                  <p className="text-gray-600 mt-1">
                    {selectedHospital?.name} • {selectedRoom?.room_code}
                  </p>
                </div>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main content - Left side (2/3 width on large screens) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Environmental Sensors */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Environmental Sensors</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <SensorCard
                      label="Temperature"
                      value={roomState.current_temp}
                      unit="°C"
                      status={getSensorStatus(roomState.current_temp, SENSOR_THRESHOLDS.temperature)}
                      icon={<Thermometer className="h-5 w-5" />}
                    />
                    <SensorCard
                      label="Humidity"
                      value={roomState.current_humidity || 0}
                      unit="%"
                      status={getSensorStatus(
                        roomState.current_humidity || 0,
                        SENSOR_THRESHOLDS.humidity
                      )}
                      icon={<Droplets className="h-5 w-5" />}
                    />
                    <SensorCard
                      label="Pressure"
                      value={roomState.current_pressure}
                      unit="Pa"
                      status={getSensorStatus(roomState.current_pressure, SENSOR_THRESHOLDS.pressure)}
                      icon={<Gauge className="h-5 w-5" />}
                      decimals={2}
                    />
                  </div>
                </div>

                {/* ACH Widget */}
                <ACHWidget
                  theoretical={roomState.ach_theoretical}
                  empirical={roomState.ach_empirical}
                  ahuCycleStartTime={roomState.ahu_cycle_start_time}
                  logicAhu={roomState.current_logic_ahu}
                />

                {/* Medical Gases */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Medical Gases</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <SensorCard
                      label="Oxygen (O₂)"
                      value={roomState.oxygen || 0}
                      unit="PSI"
                      status={getSensorStatus(roomState.oxygen || 0, SENSOR_THRESHOLDS.oxygen)}
                      icon={<Wind className="h-5 w-5" />}
                      decimals={1}
                    />
                    <SensorCard
                      label="Nitrous Oxide (N₂O)"
                      value={roomState.nitrous || 0}
                      unit="PSI"
                      status={getSensorStatus(roomState.nitrous || 0, SENSOR_THRESHOLDS.nitrous)}
                      icon={<Activity className="h-5 w-5" />}
                      decimals={1}
                    />
                    <SensorCard
                      label="Medical Air"
                      value={roomState.air || 0}
                      unit="PSI"
                      status={getSensorStatus(roomState.air || 0, SENSOR_THRESHOLDS.air)}
                      icon={<Wind className="h-5 w-5" />}
                      decimals={1}
                    />
                    <SensorCard
                      label="Vacuum"
                      value={roomState.vacuum || 0}
                      unit="PSI"
                      status={getSensorStatus(roomState.vacuum || 0, SENSOR_THRESHOLDS.vacuum)}
                      icon={<Gauge className="h-5 w-5" />}
                      decimals={1}
                    />
                    <SensorCard
                      label="Instrument Air"
                      value={roomState.instrument || 0}
                      unit="PSI"
                      status={getSensorStatus(roomState.instrument || 0, SENSOR_THRESHOLDS.instrument)}
                      icon={<Activity className="h-5 w-5" />}
                      decimals={1}
                    />
                    <SensorCard
                      label="Carbon Dioxide (CO₂)"
                      value={roomState.carbon || 0}
                      unit="PSI"
                      status={getSensorStatus(roomState.carbon || 0, SENSOR_THRESHOLDS.carbon)}
                      icon={<Beaker className="h-5 w-5" />}
                      decimals={1}
                    />
                  </div>
                </div>
              </div>

              {/* Timer Widgets - Right side (1/3 width on large screens) */}
              {isAdmin() && numericRoomId && (
                <div className="space-y-6">
                  <StopwatchWidget roomId={numericRoomId} roomState={roomState} />
                  <CountdownWidget roomId={numericRoomId} roomState={roomState} />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}
