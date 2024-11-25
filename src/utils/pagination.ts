import { nonNullable } from './common'
import type { PaginationQuery } from './schemas'

export const getPaginationValues = (
  { limit, page }: PaginationQuery,
  defaultLimit = 10
) => {
  if (page && typeof limit === 'undefined') {
    return {
      page,
      limit: defaultLimit,
      offset: (page - 1) * defaultLimit
    }
  }
  if (limit && typeof page === 'undefined') {
    const defaultPage = 1

    return {
      page: defaultPage,
      limit,
      offset: (defaultPage - 1) * limit
    }
  }
  const offset = limit && page ? (page - 1) * limit : undefined

  return { offset, limit, page }
}

type PaginationMeta = {
  total: number | undefined
  limit: number | undefined
  offset: number | undefined
  page: number | undefined
}
export const getPaginationMeta = ({
  limit,
  offset,
  page,
  total
}: PaginationMeta) =>
  nonNullable(limit) &&
  nonNullable(offset) &&
  nonNullable(page) &&
  nonNullable(total)
    ? {
        total,
        limit,
        offset,
        page
      }
    : undefined
