import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { roomService } from '@/services/room.service'
import { useAuthStore } from '@/store/auth'
import type { TheaterState } from '@/types/theater'

interface StopwatchWidgetProps {
  roomId: number
  roomState: TheaterState
}

export function StopwatchWidget({ roomId, roomState }: StopwatchWidgetProps) {
  const queryClient = useQueryClient()
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const [displayTime, setDisplayTime] = useState(0)

  // Calculate display time based on room state
  useEffect(() => {
    if (!roomState) return

    let rafId: number

    const updateDisplay = () => {
      let totalSeconds = roomState.op_accumulated_seconds

      if (roomState.op_is_running && roomState.op_start_time) {
        const elapsed =
          (Date.now() - new Date(roomState.op_start_time).getTime()) / 1000
        totalSeconds += elapsed
      }

      setDisplayTime(totalSeconds)

      if (roomState.op_is_running) {
        rafId = requestAnimationFrame(updateDisplay)
      }
    }

    updateDisplay()

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [roomState])

  const timerMutation = useMutation({
    mutationFn: (action: 'start' | 'stop' | 'reset') =>
      roomService.controlTimer(roomId, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-state', roomId] })
    },
  })

  const handleStart = () => timerMutation.mutate('start')
  const handleStop = () => timerMutation.mutate('stop')
  const handleReset = () => timerMutation.mutate('reset')

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Operation Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-5xl font-bold font-mono text-blue-600 tabular-nums">
            {formatDuration(displayTime)}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {roomState.op_is_running ? 'Running' : 'Stopped'}
          </p>
        </div>

        {isAdmin() && (
          <div className="flex gap-2">
            {!roomState.op_is_running ? (
              <Button
                onClick={handleStart}
                disabled={timerMutation.isPending}
                className="flex-1"
                variant="default"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button
                onClick={handleStop}
                disabled={timerMutation.isPending}
                className="flex-1"
                variant="secondary"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
            <Button
              onClick={handleReset}
              disabled={timerMutation.isPending}
              variant="outline"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!isAdmin() && (
          <p className="text-xs text-center text-gray-500">
            Admin access required to control timer
          </p>
        )}
      </CardContent>
    </Card>
  )
}
