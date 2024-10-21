import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { tasks, type InsertTask } from '~/db/schema'

export const getTasks = () => db.query.tasks.findMany()

export const getTaskById = (taskId: number) =>
  db.query.tasks.findFirst({
    where: ({ id }) => eq(id, taskId)
  })

export const createTask = (task: InsertTask) =>
  db.insert(tasks).values(task).returning()

export const updateTask = (taskId: number, task: Partial<InsertTask>) =>
  db.update(tasks).set(task).where(eq(tasks.id, taskId)).returning()

export const deleteTask = (taskId: number) =>
  db.delete(tasks).where(eq(tasks.id, taskId)).returning()
