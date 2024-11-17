import type {
  SelectExercise,
  SelectExerciseWithDetails,
  SelectExerciseWithDetailsAndAttributes
} from '~/lib/dbSchema/exercise'
import type { SelectExerciseCategory } from '~/lib/dbSchema/exerciseCategory'
import type { SelectMuscleGroup } from '~/lib/dbSchema/muscleGroups'
import type { SelectWorkoutExerciseAttribute } from '~/lib/dbSchema/workoutExerciseAttributes'

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
  attributes: Array<SelectWorkoutExerciseAttribute>,
  workoutExerciseId: string
): SelectExerciseWithDetailsAndAttributes => ({
  workoutExerciseId,
  ...transformRawExercise(exercise),
  attributes
})
