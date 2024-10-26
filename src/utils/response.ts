export type SuccessResponse<T> = {
  status: 'SUCCESS'
  data: T
}

export type ErrorResponse<T extends string> = {
  status: 'ERROR'
  code: T
  error: string
}

export const successResponse = <T>(data: T): SuccessResponse<T> => ({
  status: 'SUCCESS',
  data,
})

export const errorResponse = <T extends string>(
  code: T,
  error: string
): ErrorResponse<T> => ({
  status: 'ERROR',
  code,
  error,
})
