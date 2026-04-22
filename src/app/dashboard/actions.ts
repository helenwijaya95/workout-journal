'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { WorkoutType } from '@/types/database'

export async function logWorkout(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const type = formData.get('type') as WorkoutType
  const duration = parseInt(formData.get('duration_minutes') as string)
  const intensity = parseInt(formData.get('intensity') as string)
  const notes = formData.get('notes') as string
  const workout_date = formData.get('workout_date') as string

  if (!type || !duration || !intensity || !workout_date) {
    return { error: 'Please fill in all required fields' }
  }

  const { error } = await supabase.from('workouts').insert({
    user_id: user.id,
    type,
    duration_minutes: duration,
    intensity,
    notes: notes || null,
    workout_date,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}