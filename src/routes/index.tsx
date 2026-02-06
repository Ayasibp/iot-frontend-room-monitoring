import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { roomService } from '@/services/room.service'
import { ROOM_IDS } from '@/lib/constants'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Thermometer, Wind, Activity } from 'lucide-react'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    // Require authentication
    if (!context.auth.isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  // Fetch state for all rooms
  const roomQueries = ROOM_IDS.map((roomId) =>
    useQuery({
      queryKey: ['room-state', roomId],
      queryFn: () => roomService.getRoomState(roomId),
      refetchInterval: 5000, // Poll every 5 seconds
    })
  )

  const isLoading = roomQueries.some((query) => query.isLoading)
  const hasError = roomQueries.some((query) => query.isError)

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor all operating theater rooms in real-time
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : hasError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Failed to load room data. Please check your connection.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roomQueries.map((query, index) => {
              const roomId = ROOM_IDS[index]
              const data = query.data

              if (!data) return null

              const tempStatus = getTemperatureStatus(data.current_temp)
              const achStatus = getACHStatus(data.ach_theoretical)

              return (
                <Link key={roomId} to="/room/$roomId" params={{ roomId }}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{roomId}</CardTitle>
                        <Badge variant={achStatus.variant as any}>
                          {data.ahu_cycle_start_time ? 'Measuring' : 'Stable'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Temperature */}
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tempStatus.bgColor}`}>
                          <Thermometer className={`h-5 w-5 ${tempStatus.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Temperature</p>
                          <p className="text-lg font-semibold">
                            {data.current_temp.toFixed(1)}°C
                          </p>
                        </div>
                        <Badge variant={tempStatus.variant as any} className="ml-auto">
                          {tempStatus.label}
                        </Badge>
                      </div>

                      {/* Pressure */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Wind className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Pressure</p>
                          <p className="text-lg font-semibold">
                            {data.current_pressure.toFixed(2)} Pa
                          </p>
                        </div>
                      </div>

                      {/* ACH */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100">
                          <Activity className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">ACH</p>
                          <p className="text-lg font-semibold">
                            {data.ach_theoretical.toFixed(1)} / {data.ach_empirical.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      {/* Operation Status */}
                      {data.op_is_running && (
                        <div className="pt-2 border-t">
                          <Badge variant="default">Operation in Progress</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

function getTemperatureStatus(temp: number) {
  if (temp < 20 || temp > 25) {
    return {
      label: 'Alert',
      variant: 'destructive',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    }
  }
  if (temp > 24) {
    return {
      label: 'Warning',
      variant: 'secondary',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    }
  }
  return {
    label: 'Normal',
    variant: 'default',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  }
}

function getACHStatus(ach: number) {
  if (ach < 15) {
    return { label: 'Low', variant: 'destructive' }
  }
  if (ach < 20) {
    return { label: 'Warning', variant: 'secondary' }
  }
  return { label: 'Good', variant: 'default' }
}
