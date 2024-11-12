import type {
  SelectExerciseWithDetails,
  SelectExercise
} from '~/lib/dbSchemaNew/exercise'
import type { SelectExerciseCategory } from '~/lib/dbSchemaNew/exerciseCategory'
import type { SelectMuscleGroup } from '~/lib/dbSchemaNew/muscleGroups'

export type ExerciseMuscleGroupRaw = {
  muscleGroup: SelectMuscleGroup
}

type RawExercise = SelectExercise & {
  category: SelectExerciseCategory
  muscleGroups: Array<ExerciseMuscleGroupRaw>
}

export const transformRawExercise = (
  exercise: RawExercise
): SelectExercise<SelectExerciseWithDetails> => {
  const { muscleGroups, ...rest } = exercise

  return {
    ...rest,
    muscleGroups: muscleGroups.map(muscleGroup => muscleGroup.muscleGroup)
  }
}
