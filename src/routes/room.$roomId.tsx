import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { roomService } from '@/services/room.service'
import { AppLayout } from '@/components/AppLayout'
import { SensorCard } from '@/components/SensorCard'
import { ACHWidget } from '@/components/ACHWidget'
import { StopwatchWidget } from '@/components/StopwatchWidget'
import { CountdownWidget } from '@/components/CountdownWidget'
import { Loader2, Thermometer, Droplets, Gauge, Wind, Activity, Beaker } from 'lucide-react'
import { getSensorStatus } from '@/lib/utils'
import { SENSOR_THRESHOLDS } from '@/lib/constants'
import { useAuthStore } from '@/store/auth'

export const Route = createFileRoute('/room/$roomId')({
  beforeLoad: ({ context }) => {
    // Require authentication
    if (!context.auth.isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: RoomPage,
})

function RoomPage() {
  const { roomId } = Route.useParams()
  const isAdmin = useAuthStore((state) => state.isAdmin)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['room-state', roomId],
    queryFn: () => roomService.getRoomState(roomId),
    refetchInterval: 2000, // Poll every 2 seconds for live data
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room: {roomId}</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and controls</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Failed to load room data. Please check your connection.
            </p>
          </div>
        ) : data ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main content - Left side (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Environmental Sensors */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Environmental Sensors</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <SensorCard
                    label="Temperature"
                    value={data.current_temp}
                    unit="°C"
                    status={getSensorStatus(data.current_temp, SENSOR_THRESHOLDS.temperature)}
                    icon={<Thermometer className="h-5 w-5" />}
                  />
                  <SensorCard
                    label="Humidity"
                    value={data.current_humidity || 0}
                    unit="%"
                    status={getSensorStatus(
                      data.current_humidity || 0,
                      SENSOR_THRESHOLDS.humidity
                    )}
                    icon={<Droplets className="h-5 w-5" />}
                  />
                  <SensorCard
                    label="Pressure"
                    value={data.current_pressure}
                    unit="Pa"
                    status={getSensorStatus(data.current_pressure, SENSOR_THRESHOLDS.pressure)}
                    icon={<Gauge className="h-5 w-5" />}
                    decimals={2}
                  />
                </div>
              </div>

              {/* ACH Widget */}
              <ACHWidget
                theoretical={data.ach_theoretical}
                empirical={data.ach_empirical}
                ahuCycleStartTime={data.ahu_cycle_start_time}
              />

              {/* Medical Gases */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Medical Gases</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <SensorCard
                    label="Oxygen (O₂)"
                    value={data.oxygen || 0}
                    unit="PSI"
                    status={getSensorStatus(data.oxygen || 0, SENSOR_THRESHOLDS.oxygen)}
                    icon={<Wind className="h-5 w-5" />}
                    decimals={1}
                  />
                  <SensorCard
                    label="Nitrous Oxide (N₂O)"
                    value={data.nitrous || 0}
                    unit="PSI"
                    status={getSensorStatus(data.nitrous || 0, SENSOR_THRESHOLDS.nitrous)}
                    icon={<Activity className="h-5 w-5" />}
                    decimals={1}
                  />
                  <SensorCard
                    label="Medical Air"
                    value={data.air || 0}
                    unit="PSI"
                    status={getSensorStatus(data.air || 0, SENSOR_THRESHOLDS.air)}
                    icon={<Wind className="h-5 w-5" />}
                    decimals={1}
                  />
                  <SensorCard
                    label="Vacuum"
                    value={data.vacuum || 0}
                    unit="PSI"
                    status={getSensorStatus(data.vacuum || 0, SENSOR_THRESHOLDS.vacuum)}
                    icon={<Gauge className="h-5 w-5" />}
                    decimals={1}
                  />
                  <SensorCard
                    label="Instrument Air"
                    value={data.instrument || 0}
                    unit="PSI"
                    status={getSensorStatus(data.instrument || 0, SENSOR_THRESHOLDS.instrument)}
                    icon={<Activity className="h-5 w-5" />}
                    decimals={1}
                  />
                  <SensorCard
                    label="Carbon Dioxide (CO₂)"
                    value={data.carbon || 0}
                    unit="PSI"
                    status={getSensorStatus(data.carbon || 0, SENSOR_THRESHOLDS.carbon)}
                    icon={<Beaker className="h-5 w-5" />}
                    decimals={1}
                  />
                </div>
              </div>
            </div>

            {/* Timer Widgets - Right side (1/3 width on large screens) */}
            {isAdmin() && (
              <div className="space-y-6">
                <StopwatchWidget roomId={roomId} roomState={data} />
                <CountdownWidget roomState={data} />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}
