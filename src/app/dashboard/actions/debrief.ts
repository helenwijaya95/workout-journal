'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Workout } from '@/types/database'
import { getWeekEnd, getWorkoutLabel } from '@/lib/workout-utils'

function buildPrompt(workouts: Workout[], weekStart: string): string {
  const weekEnd = getWeekEnd(weekStart)

  const workoutSummary = workouts.map((w) => ({
    date: w.workout_date,
    type: getWorkoutLabel(w.type),
    duration: `${w.duration_minutes} minutes`,
    intensity: `${w.intensity}/10`,
    notes: w.notes || 'none',
  }))

  return `You are an experienced personal trainer analysing a client's training week.

Week: ${weekStart} to ${weekEnd}
Total sessions: ${workouts.length}
Total minutes: ${workouts.reduce((sum, w) => sum + w.duration_minutes, 0)}

Workouts this week:
${JSON.stringify(workoutSummary, null, 2)}

Analyse this training week and respond ONLY with a valid JSON object in this exact structure:
{
  "summary": "2-3 sentence plain English overview of the week. Warm, encouraging but honest tone. Mention specific workouts.",
  "insights": {
    "highlights": ["one specific positive thing from the week", "another if warranted"],
    "flags": ["one concern if any — overtraining, low recovery, intensity spikes. Empty array if none."],
    "suggestions": ["one specific, actionable suggestion for next week based on this week's data"]
  }
}

Rules:
- Be specific — reference actual workouts, not generic advice
- Flags should only appear if genuinely warranted — don't manufacture concerns
- Suggestions must be concrete and based on the actual data
- Keep the tone like a knowledgeable friend, not a corporate wellness app
- Return ONLY the JSON object, no markdown, no preamble`
}

// retry helper
async function callGeminiWithRetry(
  prompt: string,
  maxRetries: number = 3
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt)
      const content = result.response.text()

      if (!content) throw new Error('Empty response from model')
      return content

    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      const message = lastError.message.toLowerCase()

      // don't retry on non-recoverable errors
      if (
        message.includes('api key') ||
        message.includes('permission') ||
        message.includes('not found')
      ) {
        throw lastError
      }

      // only retry on busy / rate limit errors
      const isRetryable =
        message.includes('429') ||
        message.includes('quota') ||
        message.includes('busy') ||
        message.includes('overloaded') ||
        message.includes('503') ||
        message.includes('resource exhausted')

      if (!isRetryable) throw lastError

      // exponential backoff — wait longer on each retry
      if (attempt < maxRetries - 1) {
        const waitMs = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
        console.log(`Gemini busy, retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, waitMs))
      }
    }
  }

  throw lastError ?? new Error('Max retries exceeded')
}

export async function generateDebrief(weekStart: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // check if debrief already exists
  const { data: existing } = await supabase
    .from('ai_debriefs')
    .select('*')
    .eq('user_id', user.id)
    .eq('week_start', weekStart)
    .single()

  if (existing) return { data: existing }

  const weekEnd = getWeekEnd(weekStart)

  const { data: workouts, error: fetchError } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .gte('workout_date', weekStart)
    .lte('workout_date', weekEnd)
    .order('workout_date', { ascending: true })

  if (fetchError) return { error: `DB fetch error: ${fetchError.message}` }
  if (!workouts || workouts.length === 0) return { error: 'No workouts found for this week' }


  // verify API key exists before calling OpenAI
  if (!process.env.GEMINI_API_KEY) {
    return { error: 'Gemini API key is not configured' }
  }

try {
    const content = await callGeminiWithRetry(buildPrompt(workouts, weekStart))

    // strip markdown fences just in case
    const cleaned = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    let parsed: {
      summary: string
      insights: {
        highlights: string[]
        flags: string[]
        suggestions: string[]
      }
    }

    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return { error: `AI returned unexpected format. Please try again.` }
    }

    const totalMinutes = workouts.reduce((sum, w) => sum + w.duration_minutes, 0)
    const avgIntensity = workouts.reduce((sum, w) => sum + w.intensity, 0) / workouts.length

    const { data: debrief, error: upsertError } = await supabase
      .from('ai_debriefs')
      .upsert(
      {
        user_id: user.id,
        week_start: weekStart,
        summary: parsed.summary,
        insights: parsed.insights,
        total_sessions: workouts.length,
        total_minutes: totalMinutes,
        avg_intensity: Math.round(avgIntensity * 10) / 10,
      },
      { onConflict: 'user_id,week_start' }
    )
    .select()
    .single()

    if (upsertError) return { error: `Failed to save debrief: ${upsertError.message}` }


    revalidatePath('/dashboard')
    return { data: debrief }

  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : ''

    if (message.includes('429') || message.includes('quota') || message.includes('resource exhausted')) {
      return { error: 'AI quota exceeded. Please try again in a few minutes.' }
    }
    if (message.includes('busy') || message.includes('overloaded') || message.includes('503')) {
      return { error: 'AI is currently busy. Please try again in a moment.' }
    }

    return { error: 'Failed to generate debrief. Please try again.' }
  }
}

export async function regenerateDebrief(weekStart: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const weekEnd = getWeekEnd(weekStart)

  // fetch current workouts for this week
  const { data: workouts, error: fetchError } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .gte('workout_date', weekStart)
    .lte('workout_date', weekEnd)
    .order('workout_date', { ascending: true })

  if (fetchError) return { error: `Failed to fetch workouts: ${fetchError.message}` }
  if (!workouts || workouts.length === 0) {
    return { error: 'No workouts found for this week' }
  }

  // call AI first — only delete old debrief if AI succeeds
  // this prevents data loss if the AI call fails
  let content: string
  try {
    content = await callGeminiWithRetry(buildPrompt(workouts, weekStart))
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : ''
    if (message.includes('429') || message.includes('quota') || message.includes('resource exhausted')) {
      return { error: 'AI quota exceeded. Please try again in a few minutes.' }
    }
    if (message.includes('busy') || message.includes('overloaded') || message.includes('503')) {
      return { error: 'AI is currently busy. Please try again in a moment.' }
    }
    return { error: 'Failed to generate debrief. Please try again.' }
  }

  // parse response
  const cleaned = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  let parsed: {
    summary: string
    insights: {
      highlights: string[]
      flags: string[]
      suggestions: string[]
    }
  }

  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return { error: 'AI returned unexpected format. Please try again.' }
  }

  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration_minutes, 0)
  const avgIntensity = workouts.reduce((sum, w) => sum + w.intensity, 0) / workouts.length

  // upsert — inserts if not exists, updates if it does
  // eliminates the race condition between delete and insert
  const { data: debrief, error: upsertError } = await supabase
    .from('ai_debriefs')
    .upsert(
      {
        user_id: user.id,
        week_start: weekStart,
        summary: parsed.summary,
        insights: parsed.insights,
        total_sessions: workouts.length,
        total_minutes: totalMinutes,
        avg_intensity: Math.round(avgIntensity * 10) / 10,
      },
      {
        onConflict: 'user_id,week_start', // matches your unique constraint
      }
    )
    .select()
    .single()

  if (upsertError) return { error: `Failed to save debrief: ${upsertError.message}` }

  revalidatePath('/dashboard')
  return { data: debrief }
}