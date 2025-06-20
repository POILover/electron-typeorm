import { ApiResponseFactory, type ApiResponse } from './response'

export function handleErrorToResponse<T>(error: unknown): ApiResponse<T> {
  if (error instanceof Error) {
    return ApiResponseFactory.fail(error.message)
  }
  return ApiResponseFactory.fail('服务器错误')
}
