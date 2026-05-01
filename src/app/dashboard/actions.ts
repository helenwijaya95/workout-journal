'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { WorkoutType } from '@/types/database'
import { getAuthenticatedUser } from '@/lib/guards'

export async function logWorkout(formData: FormData) {
  const {user, errorAuth} = await getAuthenticatedUser()
  if(errorAuth || !user) return { error: errorAuth ?? 'Not authenticated'}
  
  const type = formData.get('type') as WorkoutType
  const duration = parseInt(formData.get('duration_minutes') as string)
  const intensity = parseInt(formData.get('intensity') as string)
  const notes = formData.get('notes') as string
  const workout_date = formData.get('workout_date') as string

  if (!type || !duration || !intensity || !workout_date) {
    return { error: 'Please fill in all required fields' }
  }

  const supabase = await createClient()
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

export async function updateWorkout(workoutId: string, formData: FormData) {
  const {user, errorAuth} = await getAuthenticatedUser()
  if(errorAuth || !user) return { error: errorAuth ?? 'Not authenticated'}

  const type = formData.get('type') as WorkoutType
  const duration = parseInt(formData.get('duration_minutes') as string)
  const intensity = parseInt(formData.get('intensity') as string)
  const notes = formData.get('notes') as string
  const workout_date = formData.get('workout_date') as string

  if (!type || !duration || !intensity || !workout_date) {
    return { error: 'Please fill in all required fields' }
  }
  
  const supabase = await createClient()
  const { error } = await supabase
    .from('workouts')
    .update({
      type,
      duration_minutes: duration,
      intensity,
      notes: notes || null,
      workout_date,
    })
    .eq('id', workoutId)
    .eq('user_id', user.id) // RLS + explicit filter — safety double lock

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteWorkout(workoutId: string) {
  const {user, errorAuth} = await getAuthenticatedUser()
  if(errorAuth || !user) return { error: errorAuth ?? 'Not authenticated'}

  const supabase = await createClient()
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId)
    .eq('user_id', user.id) // safety double lock

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}