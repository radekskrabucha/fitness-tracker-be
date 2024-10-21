import type { AppRouteHandler } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type {
  GetAllTasks,
  CreateTask,
  DeleteTask,
  UpdateTask,
  GetTaskById
} from './tasks.routes'
import * as tasksService from './tasks.services'

export const getAllTasks: AppRouteHandler<GetAllTasks> = async c => {
  const tasks = await tasksService.getTasks()

  return c.json(tasks, OK)
}

export const getTaskById: AppRouteHandler<GetTaskById> = async c => {
  const { id } = c.req.valid('param')

  const task = await tasksService.getTaskById(id)

  if (!task) {
    return c.json(
      {
        message: 'Task not found'
      },
      NOT_FOUND
    )
  }

  return c.json(task, OK)
}

export const createTask: AppRouteHandler<CreateTask> = async c => {
  const taskReq = c.req.valid('json')

  const [task] = await tasksService.createTask(taskReq)

  return c.json(task, OK)
}

export const updateTask: AppRouteHandler<UpdateTask> = async c => {
  const { id } = c.req.valid('param')
  const taskReq = c.req.valid('json')

  const [task] = await tasksService.updateTask(id, taskReq)

  if (!task) {
    return c.json(
      {
        message: 'Task not found'
      },
      NOT_FOUND
    )
  }

  return c.json(task, OK)
}

export const deleteTask: AppRouteHandler<DeleteTask> = async c => {
  const { id } = c.req.valid('param')

  const [task] = await tasksService.deleteTask(id)

  if (!task) {
    return c.json(
      {
        message: 'Task not found'
      },
      NOT_FOUND
    )
  }

  return c.json(task, OK)
}
