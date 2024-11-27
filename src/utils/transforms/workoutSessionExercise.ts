import type { SelectUserWorkoutSessionExerciseAttribute } from '~/lib/dbSchema/workoutSessionAttributes'
import type {
  SelectWorkoutSessionExerciseWithExtras,
  SelectWorkoutSessionExerciseRaw
} from '~/lib/dbSchema/workoutSessionExercise'

type WorkoutSessionExerciseRaw = SelectWorkoutSessionExerciseRaw & {
  attributes: Array<SelectUserWorkoutSessionExerciseAttribute>
}

export const transformWorkoutSessionExercise = ({
  attributes,
  completed,
  id,
  notes
}: WorkoutSessionExerciseRaw): SelectWorkoutSessionExerciseWithExtras => ({
  id,
  notes,
  completed,
  attributes
})
