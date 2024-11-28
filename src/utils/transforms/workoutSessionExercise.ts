import type { SelectUserWorkoutSessionExerciseAttribute } from '~/lib/dbSchema/workoutSessionAttributes'
import type {
  SelectWorkoutSessionExerciseWithExtras,
  SelectWorkoutSessionExerciseRaw
} from '~/lib/dbSchema/workoutSessionExercise'
import { transformRawExercise } from './exercise'

type TransformExerciseParameters = Parameters<typeof transformRawExercise>

type WorkoutSessionExerciseRaw = SelectWorkoutSessionExerciseRaw & {
  attributes: Array<SelectUserWorkoutSessionExerciseAttribute>
  exercise: TransformExerciseParameters[0]
}

export const transformWorkoutSessionExercise = ({
  attributes,
  completed,
  id,
  notes,
  exercise
}: WorkoutSessionExerciseRaw): SelectWorkoutSessionExerciseWithExtras => ({
  id,
  notes,
  completed,
  attributes,
  exercise: transformRawExercise(exercise)
})
