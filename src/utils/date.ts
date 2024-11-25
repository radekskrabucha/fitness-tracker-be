import { getDay } from 'date-fns'
import type { DayOfWeek } from '~/lib/dbSchema/workoutAttributes'

export const getNow = () => new Date()

export const getTodayDayOfWeek = () => getDay(getNow())

export const dayOfWeekToDbEnum: Record<number, DayOfWeek> = {
  [0]: 'sunday',
  [1]: 'monday',
  [2]: 'tuesday',
  [3]: 'wednesday',
  [4]: 'thursday',
  [5]: 'friday',
  [6]: 'saturday'
}
export const getDayOfWeekToDbEnum = (day: number) => {
  const dayOfWeek = dayOfWeekToDbEnum[day]

  if (!dayOfWeek) {
    throw new Error(`Invalid day of week: ${day}`)
  }

  return dayOfWeek
}
