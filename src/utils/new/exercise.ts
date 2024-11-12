import type {
  SelectExercise,
  SelectExerciseWithDetails,
  SelectExerciseWithDetailsAndAttributes
} from '~/lib/dbSchemaNew/exercise'
import type { SelectExerciseCategory } from '~/lib/dbSchemaNew/exerciseCategory'
import type { SelectMuscleGroup } from '~/lib/dbSchemaNew/muscleGroups'
import type { SelectDefaultWorkoutExerciseAttribute } from '~/lib/dbSchemaNew/workoutExerciseAttributes'

export type ExerciseMuscleGroupRaw = {
  muscleGroup: SelectMuscleGroup
}

export type ExerciseRaw = SelectExercise & {
  category: SelectExerciseCategory
  muscleGroups: Array<ExerciseMuscleGroupRaw>
}

export const transformRawExercise = (
  exercise: ExerciseRaw
): SelectExerciseWithDetails => {
  const { muscleGroups, ...rest } = exercise

  return {
    ...rest,
    muscleGroups: muscleGroups.map(muscleGroup => muscleGroup.muscleGroup)
  }
}

export const transformRawExerciseWithAttributes = (
  exercise: ExerciseRaw,
  attributes: Array<SelectDefaultWorkoutExerciseAttribute>
): SelectExerciseWithDetailsAndAttributes => ({
  ...transformRawExercise(exercise),
  attributes: attributes.map(
    ({
      attributeName,
      createdAt,
      id,
      updatedAt,
      value,
      workoutExerciseId
    }) => ({
      attributeName,
      createdAt,
      id,
      updatedAt,
      value,
      workoutExerciseId
    })
  )
})
