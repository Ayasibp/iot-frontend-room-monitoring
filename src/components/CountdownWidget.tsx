import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Timer, Bell, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { roomService } from '@/services/room.service'
import type { TheaterState } from '@/types/theater'
import { toast } from 'sonner'

interface CountdownWidgetProps {
  roomState: TheaterState
}

export function CountdownWidget({ roomState }: CountdownWidgetProps) {
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const [remainingTime, setRemainingTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [durationMinutes, setDurationMinutes] = useState(60)

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
        toast.success(`Timer for ${roomState.room_name} has finished.`, {
          description: 'Countdown Complete!',
        })
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

  const handleStart = async () => {
    if (!roomState?.room_name) return

    try {
      setIsLoading(true)
      await roomService.controlCountdownTimer(roomState.room_name, {
        action: 'start',
        duration_minutes: durationMinutes,
      })
      toast.success(`Timer started for ${durationMinutes} minutes.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start countdown timer')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStop = async () => {
    if (!roomState?.room_name) return

    try {
      setIsLoading(true)
      await roomService.controlCountdownTimer(roomState.room_name, {
        action: 'stop',
      })
      toast.success('Timer has been paused.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to stop countdown timer')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    if (!roomState?.room_name) return

    try {
      setIsLoading(true)
      await roomService.controlCountdownTimer(roomState.room_name, {
        action: 'reset',
      })
      setIsComplete(false)
      toast.success('Timer has been reset.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reset countdown timer')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdjust = async (minutes: 1 | -1) => {
    if (!roomState?.room_name) return

    try {
      setIsLoading(true)
      await roomService.adjustCountdownTimer(roomState.room_name, minutes)
      toast.success(`${minutes > 0 ? 'Added' : 'Subtracted'} 1 minute.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to adjust countdown timer')
    } finally {
      setIsLoading(false)
    }
  }

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
          <div className="space-y-3">
            {/* Duration Input (only when timer is not running) */}
            {!roomState.cd_is_running && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="999"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="text-center"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-2">
              {!roomState.cd_is_running ? (
                <Button
                  onClick={handleStart}
                  disabled={isLoading || durationMinutes < 1}
                  className="flex-1"
                  variant="default"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handleStop}
                  disabled={isLoading}
                  className="flex-1"
                  variant="outline"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1"
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Adjust Buttons (only when timer is running) */}
            {roomState.cd_is_running && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAdjust(-1)}
                  disabled={isLoading}
                  className="flex-1"
                  variant="outline"
                  size="sm"
                >
                  <Minus className="h-4 w-4 mr-2" />
                  -1 Min
                </Button>
                <Button
                  onClick={() => handleAdjust(1)}
                  disabled={isLoading}
                  className="flex-1"
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  +1 Min
                </Button>
              </div>
            )}
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
