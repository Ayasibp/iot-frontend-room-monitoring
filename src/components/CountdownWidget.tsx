import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Timer, Bell } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import type { TheaterState } from '@/types/theater'

interface CountdownWidgetProps {
  roomState: TheaterState
}

export function CountdownWidget({ roomState }: CountdownWidgetProps) {
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const [remainingTime, setRemainingTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!roomState?.cd_is_running || !roomState.cd_target_time) {
      setRemainingTime(0)
      setIsComplete(false)
      return
    }

    let rafId: number

    const updateCountdown = () => {
      const target = new Date(roomState.cd_target_time!).getTime()
      const now = Date.now()
      const remaining = Math.max(0, (target - now) / 1000)

      setRemainingTime(remaining)

      if (remaining === 0 && !isComplete) {
        setIsComplete(true)
        // Optional: Play sound or show notification
      }

      if (remaining > 0) {
        rafId = requestAnimationFrame(updateCountdown)
      }
    }

    updateCountdown()

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [roomState, isComplete])

  const progress = useMemo(() => {
    if (!roomState?.cd_is_running || !roomState.cd_duration_seconds) {
      return 0
    }
    const elapsed = roomState.cd_duration_seconds - remainingTime
    return (elapsed / roomState.cd_duration_seconds) * 100
  }, [roomState, remainingTime])

  return (
    <Card className="border-2 border-orange-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-orange-600" />
            Countdown Timer
          </CardTitle>
          {isComplete && (
            <Badge variant="destructive" className="animate-pulse">
              <Bell className="h-3 w-3 mr-1" />
              Complete!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-5xl font-bold font-mono text-orange-600 tabular-nums">
            {formatDuration(remainingTime)}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {roomState.cd_is_running
              ? isComplete
                ? 'Time Complete'
                : 'Counting Down'
              : 'Not Started'}
          </p>
        </div>

        {/* Progress Bar */}
        {roomState.cd_is_running && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-gray-500">
              {progress.toFixed(0)}% Complete
            </p>
          </div>
        )}

        {isAdmin() && (
          <div className="flex gap-2">
            <Button
              disabled
              className="flex-1"
              variant="outline"
              title="Backend API support needed"
            >
              Set Duration
            </Button>
            <Button
              disabled
              className="flex-1"
              variant="outline"
              title="Backend API support needed"
            >
              Start
            </Button>
          </div>
        )}

        <p className="text-xs text-center text-gray-500">
          {isAdmin()
            ? 'Countdown API endpoints coming soon'
            : 'Admin access required to control timer'}
        </p>
      </CardContent>
    </Card>
  )
}
