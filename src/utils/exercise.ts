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
  exerciseMuscleGroups: Array<ExerciseMuscleGroup>
}

export const transformExerciseWithDetails = (
  exercise: ExerciseWithDetailsRaw
): SelectExerciseWithDetails => {
  const { exerciseMuscleGroups, ...exerciseDetails } = exercise

  return {
    ...exerciseDetails,
    muscleGroups: exerciseMuscleGroups.map(
      muscleGroup => muscleGroup.muscleGroup
    )
  }
}
