import { Workout, WorkoutType } from '@/types/database'
import { WORKOUT_TYPES } from './workout-config'

export interface WeekGroup {
  weekStart: string
  weekEnd: string
  weekLabel: string
  workouts: Workout[]
  totalSessions: number
  totalMinutes: number
  avgIntensity: number
}

// get Monday of the week for a given date
export function getWeekStart(dateStr: string): string {
  const date = new Date(dateStr)
  const day = date.getDay()
  const diff = (day === 0 ? -6 : 1 - day) // adjust for Sunday
  date.setDate(date.getDate() + diff)
  return date.toISOString().split('T')[0]
}

export function getWeekEnd(weekStart: string): string {
  const date = new Date(weekStart)
  date.setDate(date.getDate() + 6)
  return date.toISOString().split('T')[0]
}

export function formatWeekLabel(weekStart: string): string {
  const start = new Date(weekStart)
  const end = new Date(weekStart)
  end.setDate(end.getDate() + 6)

  const startStr = start.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })
  const endStr = end.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })

  // check if current week
  const todayWeekStart = getWeekStart(new Date().toISOString().split('T')[0])
  if (weekStart === todayWeekStart) return `This week · ${startStr} – ${endStr}`

  return `${startStr} – ${endStr}`
}

export function groupWorkoutsByWeek(workouts: Workout[]): WeekGroup[] {
  const groups: Record<string, Workout[]> = {}

  workouts.forEach((workout) => {
    const weekStart = getWeekStart(workout.workout_date)
    if (!groups[weekStart]) groups[weekStart] = []
    groups[weekStart].push(workout)
  })

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a)) // most recent first
    .map(([weekStart, workouts]) => ({
      weekStart,
      weekEnd: getWeekEnd(weekStart),
      weekLabel: formatWeekLabel(weekStart),
      workouts,
      totalSessions: workouts.length,
      totalMinutes: workouts.reduce((sum, w) => sum + w.duration_minutes, 0),
      avgIntensity: Math.round(
        (workouts.reduce((sum, w) => sum + w.intensity, 0) / workouts.length) * 10
      ) / 10,
    }))
}

export function getWorkoutEmoji(type: WorkoutType): string {
  return WORKOUT_TYPES.find((t) => t.value === type)?.emoji ?? '✨'
}

export function getWorkoutLabel(type: WorkoutType): string {
  return WORKOUT_TYPES.find((t) => t.value === type)?.label ?? type
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}