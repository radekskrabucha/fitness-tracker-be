import { handle } from '@hono/node-server/vercel'
import { createApp } from '~/lib/createApp'
import { configureOpenApi } from '~/lib/openApi'
import { exercisesRouter } from '~/routes/exercises'
import { exerciseCategoriesRouter } from '~/routes/exercises/categories'
import { muscleGroupsRouter } from '~/routes/muscle-groups'
import { profileRouter } from '~/routes/profile'
import { userWorkoutsRouter } from '~/routes/user/workout'
import { userWorkoutPlansRouter } from '~/routes/user/workout-plans'
import { userWorkoutSessionsRouter } from '~/routes/user/workout-sessions'
import { workoutPlansRouter } from '~/routes/workout-plans'
import { workoutsRouter } from '~/routes/workouts'
import { env } from '~/utils/env'

export const app = createApp()

configureOpenApi(app)

app.route('/profile', profileRouter)
app.route('/exercises', exercisesRouter)
app.route('/exercise/categories', exerciseCategoriesRouter)
app.route('/muscle-groups', muscleGroupsRouter)
app.route('/workouts', workoutsRouter)
app.route('/workout-plans', workoutPlansRouter)
app.route('/user/workout-plans', userWorkoutPlansRouter)
app.route('/user/workouts', userWorkoutsRouter)
app.route('/user/workout-sessions', userWorkoutSessionsRouter)

export default handle(app)

console.log(`Server is running on port ${env.PORT}`)
