import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SensorCardProps {
  label: string
  value: number
  unit: string
  status: 'normal' | 'warning' | 'alert'
  icon?: React.ReactNode
  decimals?: number
}

export function SensorCard({
  label,
  value,
  unit,
  status,
  icon,
  decimals = 1,
}: SensorCardProps) {
  const statusConfig = {
    normal: {
      badge: 'default',
      border: 'border-green-200',
      bgIcon: 'bg-green-100',
      textIcon: 'text-green-600',
    },
    warning: {
      badge: 'secondary',
      border: 'border-yellow-200',
      bgIcon: 'bg-yellow-100',
      textIcon: 'text-yellow-600',
    },
    alert: {
      badge: 'destructive',
      border: 'border-red-200',
      bgIcon: 'bg-red-100',
      textIcon: 'text-red-600',
    },
  }

  const config = statusConfig[status]

  return (
    <Card className={cn('border-2', config.border)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Badge variant={config.badge as any}>{status.toUpperCase()}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn('p-2 rounded-lg', config.bgIcon)}>
              <div className={config.textIcon}>{icon}</div>
            </div>
          )}
          <div className="flex-1">
            <div className="text-3xl font-bold">
              {value.toFixed(decimals)}
              <span className="text-lg text-muted-foreground ml-1">{unit}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
