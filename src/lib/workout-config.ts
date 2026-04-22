export const WORKOUT_TYPES = [
  {
    value: 'strength',
    label: 'Strength',
    description: 'Weights, resistance training',
    emoji: '🏋️',
  },
  {
    value: 'cardio',
    label: 'Cardio',
    description: 'Run, cycle, swim, row',
    emoji: '🏃',
  },
  {
    value: 'group_fitness',
    label: 'Group fitness',
    description: 'HIIT, combat, spin, yoga',
    emoji: '🥊',
  },
  {
    value: 'sports',
    label: 'Sports',
    description: 'Basketball, tennis, football',
    emoji: '⚽',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Anything else',
    emoji: '✨',
  },
] as const