import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function getSensorStatus(
  value: number,
  thresholds: { min?: number; max?: number; warning?: number }
): 'normal' | 'warning' | 'alert' {
  if (thresholds.min !== undefined && value < thresholds.min) {
    return 'alert'
  }
  if (thresholds.max !== undefined && value > thresholds.max) {
    return 'alert'
  }
  if (thresholds.warning !== undefined) {
    if (thresholds.min !== undefined && value < thresholds.warning) {
      return 'warning'
    }
    if (thresholds.max !== undefined && value > thresholds.warning) {
      return 'warning'
    }
  }
  return 'normal'
}
