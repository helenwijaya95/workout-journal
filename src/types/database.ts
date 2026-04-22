export type WorkoutType = 'strength' | 'cardio' | 'group_fitness' | 'sports' | 'other'

export interface Profile {
  id: string
  name: string | null
  fitness_goal: string | null
  weekly_target: number
  created_at: string
}

export interface Workout {
  id: string
  user_id: string
  type: WorkoutType
  duration_minutes: number
  intensity: number
  notes: string | null
  workout_date: string
  created_at: string
}

export interface AiDebrief {
  id: string
  user_id: string
  week_start: string
  summary: string
  insights: {
    flags: string[]
    suggestions: string[]
    highlights: string[]
  }
  total_sessions: number
  total_minutes: number
  avg_intensity: number | null
  created_at: string
  isStale?: boolean  // client-side only, not in DB
}