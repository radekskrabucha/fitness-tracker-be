import type {
  SelectExercise,
  SelectExerciseWithDetails,
  SelectExerciseWithDetailsAndAttributes
} from '~/lib/dbSchema/exercise'
import type { SelectExerciseCategory } from '~/lib/dbSchema/exerciseCategory'
import type { SelectMuscleGroup } from '~/lib/dbSchema/muscleGroups'
import type { SelectWorkoutExerciseAttribute } from '~/lib/dbSchema/workoutExerciseAttributes'

export type ExerciseMuscleGroupRaw = {
  mG: SelectMuscleGroup
}

export type ExerciseRaw = SelectExercise & {
  c: SelectExerciseCategory
  mGs: Array<ExerciseMuscleGroupRaw>
}

export const transformRawExercise = (
  exercise: ExerciseRaw
): SelectExerciseWithDetails => {
  const { mGs, c, ...rest } = exercise

  return {
    ...rest,
    category: c,
    muscleGroups: mGs.map(muscleGroup => muscleGroup.mG)
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
