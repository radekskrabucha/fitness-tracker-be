import { createRouter } from '~/lib/createApp'
import * as handlers from './tasks.handlers'
import * as routes from './tasks.routes'

export const tasksRouter = createRouter()
  .openapi(routes.getAllTasks, handlers.getAllTasks)
  .openapi(routes.getTaskById, handlers.getTaskById)
  .openapi(routes.createTask, handlers.createTask)
  .openapi(routes.updateTask, handlers.updateTask)
  .openapi(routes.deleteTask, handlers.deleteTask)
