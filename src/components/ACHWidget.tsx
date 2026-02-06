import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface ACHWidgetProps {
  theoretical: number
  empirical: number
  ahuCycleStartTime: string | null
}

export function ACHWidget({
  theoretical,
  empirical,
  ahuCycleStartTime,
}: ACHWidgetProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const isMeasuring = ahuCycleStartTime !== null

  useEffect(() => {
    if (!ahuCycleStartTime) {
      setElapsedTime(0)
      return
    }

    let rafId: number
    const startTime = new Date(ahuCycleStartTime).getTime()

    const updateTimer = () => {
      const now = Date.now()
      const elapsed = (now - startTime) / 1000 // Convert to seconds
      setElapsedTime(elapsed)
      rafId = requestAnimationFrame(updateTimer)
    }

    rafId = requestAnimationFrame(updateTimer)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [ahuCycleStartTime])

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Air Changes per Hour (ACH)
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theoretical ACH */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-600">Theoretical</h4>
              <Badge variant="outline">Calculated</Badge>
            </div>
            <div className="text-4xl font-bold text-purple-600">
              {theoretical.toFixed(2)}
              <span className="text-lg text-gray-500 ml-2">ACH</span>
            </div>
            <p className="text-xs text-gray-500">
              Based on flow rate and room volume
            </p>
          </div>

          {/* Empirical ACH */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-600">Empirical</h4>
              {isMeasuring ? (
                <Badge variant="default" className="animate-pulse">
                  Measuring...
                </Badge>
              ) : (
                <Badge variant="secondary">Stable</Badge>
              )}
            </div>
            {isMeasuring ? (
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600">
                  {formatDuration(elapsedTime)}
                </div>
                <p className="text-xs text-gray-500">
                  Measuring AHU cycle duration
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-600">
                  {empirical.toFixed(2)}
                  <span className="text-lg text-gray-500 ml-2">ACH</span>
                </div>
                <p className="text-xs text-gray-500">
                  Based on measured cycle time
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
