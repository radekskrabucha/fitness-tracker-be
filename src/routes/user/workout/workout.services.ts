import { and, eq } from 'drizzle-orm'
import { db } from '~/db'
import { getDayOfWeekToDbEnum, getTodayDayOfWeek } from '~/utils/date'
import { transformRawWorkoutWithExercises } from '~/utils/transforms/workout'

export const getUserTodayWorkoutPlan = async (userId: string) => {
  const today = getTodayDayOfWeek()
  const dayOfWeek = getDayOfWeekToDbEnum(today)

  const retrievedUserTodayWorkouts =
    await db.query.userWorkoutAttributes.findMany({
      where: fields =>
        and(
          eq(fields.userId, userId),
          eq(fields.name, 'days_of_week'),
          eq(fields.textValue, dayOfWeek)
        ),
      columns: {},
      with: {
        workoutPlan: {
          columns: {
            id: true,
            name: true,
            description: true,
            difficultyLevel: true
          }
        },
        workout: {
          columns: {
            createdAt: false,
            updatedAt: false
          },
          with: {
            exercises: {
              columns: {
                id: true,
                orderIndex: true
              },
              with: {
                exercise: {
                  columns: {
                    createdAt: false,
                    updatedAt: false,
                    categoryId: false
                  },
                  with: {
                    category: true,
                    muscleGroups: {
                      columns: {},
                      with: {
                        muscleGroup: {
                          columns: {
                            createdAt: false,
                            updatedAt: false
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

  return retrievedUserTodayWorkouts.map(({ workoutPlan, workout }) => ({
    workoutPlan,
    workout: transformRawWorkoutWithExercises(workout)
  }))
}
