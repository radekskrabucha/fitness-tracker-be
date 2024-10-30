import type {
  SelectExercise,
  SelectExerciseCategory,
  SelectMuscleGroup,
  SelectExerciseWithDetails
} from '~/lib/dbSchema/exercise'

export type ExerciseMuscleGroup = {
  muscleGroup: SelectMuscleGroup
}

export type ExerciseWithDetailsRaw = SelectExercise & {
  category: SelectExerciseCategory
  muscleGroups: Array<ExerciseMuscleGroup>
}

export const transformExerciseWithDetails = (
  exercise: ExerciseWithDetailsRaw
): SelectExerciseWithDetails => {
  const { muscleGroups, ...exerciseDetails } = exercise

  return {
    ...exerciseDetails,
    muscleGroups: muscleGroups.map(muscleGroup => muscleGroup.muscleGroup)
  }
}
