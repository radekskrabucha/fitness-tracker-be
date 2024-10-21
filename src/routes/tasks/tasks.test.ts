import { sql } from 'drizzle-orm'
import { testClient } from 'hono/testing'
import { execSync } from 'node:child_process'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db } from '~/db'
import { tasks } from '~/db/schema'
import { createApp } from '~/lib/createApp'
import { env } from '~/utils/env'
import { tasksRouter } from './index'

if (env.NODE_ENV !== 'test') {
  throw new Error("NODE_ENV must be 'test'")
}

const client = testClient(createApp().route('/tasks', tasksRouter))

describe('Tasks Router', () => {
  let createdTaskId: string
  const taskName = 'Test Task'
  const updatedTaskName = 'Updated Test Task'

  beforeAll(async () => {
    // Run database setup script
    try {
      console.log('Running database setup...')
      execSync('pnpm drizzle-kit push', { stdio: 'inherit' })
      console.log('Database setup completed successfully.')
    } catch (error) {
      console.error('Error running database setup:', error)
      throw error
    }

    // Clear the tasks table before all tests
    await db.delete(tasks)
  })

  afterAll(async () => {
    // Drop the tasks table completely
    try {
      await db.execute(sql`DROP TABLE IF EXISTS tasks;`)
      console.log('Tasks table dropped successfully.')
    } catch (error) {
      console.error('Error dropping tasks table:', error)
      throw error
    }
  })

  it('1. GET /tasks should return an empty array', async () => {
    const response = await client.api.tasks.$get()
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([])
  })

  it('2. POST /tasks should return 422 for invalid input', async () => {
    const invalidData = { name: '' }
    const response = await client.api.tasks.$post({
      json: invalidData
    })

    expect(response.status).toBe(422)
  })

  it('3. POST /tasks should create a new task', async () => {
    const taskData = { name: taskName }
    const response = await client.api.tasks.$post({
      json: taskData
    })

    expect(response.status).toBe(200)
    const body = await response.json()

    // For typescript to be happy, message is in body when
    // there is an error, for this status code there is no message
    if ('message' in body) {
      throw new Error(`Unexpected error: ${body.message}`)
    }

    expect(body.name).toBe(taskData.name)
    expect(body.id).toBeDefined()
    expect(body.done).toBe(false)

    createdTaskId = body.id.toString()
  })

  it('4. GET /tasks/:id should return the created task', async () => {
    const response = await client.api.tasks[':id'].$get({
      param: { id: createdTaskId }
    })
    expect(response.status).toBe(200)
    const body = await response.json()

    // For typescript to be happy, message is in body when
    // there is an error, for this status code there is no message
    if ('message' in body) {
      throw new Error(`Unexpected error: ${body.message}`)
    }

    expect(body.id.toString()).toBe(createdTaskId)
    expect(body.name).toBe(taskName)
  })

  it('5. GET /tasks/:id should return 404 for non-existent task', async () => {
    const response = await client.api.tasks[':id'].$get({
      param: { id: '999' }
    })
    expect(response.status).toBe(404)
  })

  it('6. PATCH /tasks/:id should update the created task', async () => {
    const updateData = { name: updatedTaskName, done: true }
    const response = await client.api.tasks[':id'].$patch({
      param: { id: createdTaskId },
      json: updateData
    })

    expect(response.status).toBe(200)
    const body = await response.json()

    // For typescript to be happy, message is in body when
    // there is an error, for this status code there is no message
    if ('message' in body) {
      throw new Error(`Unexpected error: ${body.message}`)
    }

    expect(body.id.toString()).toBe(createdTaskId)
    expect(body.name).toBe(updateData.name)
    expect(body.done).toBe(updateData.done)
  })

  it('7. PATCH /tasks/:id should return 404 for non-existent task', async () => {
    const response = await client.api.tasks[':id'].$patch({
      param: { id: '999' },
      json: { name: 'Non-existent Task' }
    })

    expect(response.status).toBe(404)
  })

  it('8. PATCH /tasks/:id should return 422 for invalid input', async () => {
    const invalidData = { name: '' }
    const response = await client.api.tasks[':id'].$patch({
      param: { id: createdTaskId },
      json: invalidData
    })

    expect(response.status).toBe(422)
  })

  it('9. DELETE /tasks/:id should delete the created task', async () => {
    const response = await client.api.tasks[':id'].$delete({
      param: { id: createdTaskId }
    })
    expect(response.status).toBe(200)
    const body = await response.json()

    // For typescript to be happy, message is in body when
    // there is an error, for this status code there is no message
    if ('message' in body) {
      throw new Error(`Unexpected error: ${body.message}`)
    }

    expect(body.id.toString()).toBe(createdTaskId)

    const getResponse = await client.api.tasks[':id'].$get({
      param: { id: createdTaskId }
    })
    expect(getResponse.status).toBe(404)
  })

  it('10. DELETE /tasks/:id should return 404 for non-existent task', async () => {
    const response = await client.api.tasks[':id'].$delete({
      param: { id: '999' }
    })
    expect(response.status).toBe(404)
  })
})
